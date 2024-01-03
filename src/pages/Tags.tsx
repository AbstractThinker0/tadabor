import { useEffect, useReducer, useState } from "react";

import useQuran from "@/context/QuranContext";
import tagsReducer from "@/reducers/tagsReducer";
import { selectedChaptersType } from "@/types";
import { dbFuncs } from "@/util/db";

import LoadingSpinner from "@/components/LoadingSpinner";

import {
  tagsActions,
  tagsProps,
  tagsStateProps,
  versesTagsProps,
} from "@/components/Tags/consts";
import TagsSide from "@/components/Tags/TagsSide";
import TagsDisplay from "@/components/Tags/TagsDisplay";

function Tags() {
  const quranService = useQuran();

  const [loadingState, setLoadingState] = useState(true);

  const initialSelectedChapters: selectedChaptersType = {};

  quranService.chapterNames.forEach((chapter) => {
    initialSelectedChapters[chapter.id] = true;
  });

  const initialState: tagsStateProps = {
    currentChapter: 1,
    selectedChapters: initialSelectedChapters,
    tags: {},
    currentTag: null,
    versesTags: {},
    currentVerse: null,
    selectedTags: {},
    scrollKey: "",
  };

  const [state, dispatchTagsAction] = useReducer(tagsReducer, initialState);

  useEffect(() => {
    let clientLeft = false;

    async function fetchData() {
      const savedTags = await dbFuncs.loadTags();

      if (clientLeft) return;

      const initialTags: tagsProps = {};

      savedTags.forEach((tag) => {
        initialTags[tag.id] = { tagDisplay: tag.name, tagID: tag.id };
      });

      dispatchTagsAction(tagsActions.setTags(initialTags));

      const versesTags = await dbFuncs.loadVersesTags();

      if (clientLeft) return;

      const initialVersesTags: versesTagsProps = {};

      versesTags.forEach((verseTag) => {
        initialVersesTags[verseTag.verse_key] = verseTag.tags_ids;
      });

      dispatchTagsAction(tagsActions.setVersesTags(initialVersesTags));

      setLoadingState(false);
    }

    fetchData();

    return () => {
      clientLeft = true;
    };
  }, []);

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="tags">
      <TagsSide
        currentChapter={state.currentChapter}
        selectedChapters={state.selectedChapters}
        tags={state.tags}
        selectedTags={state.selectedTags}
        currentTag={state.currentTag}
        versesTags={state.versesTags}
        dispatchTagsAction={dispatchTagsAction}
      />
      <TagsDisplay
        selectedTags={state.selectedTags}
        selectedChapters={state.selectedChapters}
        tags={state.tags}
        versesTags={state.versesTags}
        currentChapter={state.currentChapter}
        currentVerse={state.currentVerse}
        scrollKey={state.scrollKey}
        dispatchTagsAction={dispatchTagsAction}
      />
    </div>
  );
}

export default Tags;
