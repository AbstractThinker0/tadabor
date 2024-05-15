import { useEffect, useState } from "react";

import useQuran from "@/context/useQuran";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { selectedChaptersType } from "@/types";
import { dbFuncs } from "@/util/db";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { tagsProps, versesTagsProps } from "@/components/Tags/consts";
import TagsSide from "@/components/Tags/TagsSide";
import TagsDisplay from "@/components/Tags/TagsDisplay";

function Tags() {
  const quranService = useQuran();

  const [loadingState, setLoadingState] = useState(true);
  const tagsState = useAppSelector((state) => state.tagsPage);
  const dispatch = useAppDispatch();
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  useEffect(() => {
    let clientLeft = false;

    // Check if we need to set default selected chapters
    if (!Object.keys(tagsState.selectedChapters).length) {
      const initialSelectedChapters: selectedChaptersType = {};

      quranService.chapterNames.forEach((chapter) => {
        initialSelectedChapters[chapter.id] = true;
      });

      dispatch(tagsPageActions.setSelectedChapters(initialSelectedChapters));
    }

    async function fetchData() {
      const savedTags = await dbFuncs.loadTags();

      if (clientLeft) return;

      const initialTags: tagsProps = {};

      savedTags.forEach((tag) => {
        initialTags[tag.id] = { tagDisplay: tag.name, tagID: tag.id };
      });

      dispatch(tagsPageActions.setTags(initialTags));

      const versesTags = await dbFuncs.loadVersesTags();

      if (clientLeft) return;

      const initialVersesTags: versesTagsProps = {};

      versesTags.forEach((verseTag) => {
        initialVersesTags[verseTag.verse_key] = verseTag.tags_ids;
      });

      dispatch(tagsPageActions.setVersesTags(initialVersesTags));

      setLoadingState(false);
    }

    fetchData();
    dispatch(fetchVerseNotes());

    return () => {
      clientLeft = true;
    };
  }, []);

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="tags">
      <TagsSide />
      {isVNotesLoading ? <LoadingSpinner /> : <TagsDisplay />}
    </div>
  );
}

export default Tags;
