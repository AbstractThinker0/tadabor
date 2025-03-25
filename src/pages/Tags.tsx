import { useEffect, useState } from "react";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { dbFuncs } from "@/util/db";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { tagsProps, versesTagsProps } from "@/components/Pages/Tags/consts";
import TagsSide from "@/components/Pages/Tags/TagsSide";
import TagsDisplay from "@/components/Pages/Tags/TagsDisplay";

import { Flex } from "@chakra-ui/react";

function Tags() {
  const [loadingState, setLoadingState] = useState(true);

  const dispatch = useAppDispatch();

  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  const tags = useAppSelector((state) => state.tagsPage.tags);

  useEffect(() => {
    let clientLeft = false;

    async function fetchSavedTags() {
      // Check if we already fetched tags
      if (Object.keys(tags).length) {
        setLoadingState(false);
        return;
      }

      const savedTags = await dbFuncs.loadTags();
      const versesTags = await dbFuncs.loadVersesTags();

      if (clientLeft) return;

      const initialTags: tagsProps = {};

      savedTags.forEach((tag) => {
        initialTags[tag.id] = { tagDisplay: tag.name, tagID: tag.id };
      });

      dispatch(tagsPageActions.setTags(initialTags));

      const initialVersesTags: versesTagsProps = {};

      versesTags.forEach((verseTag) => {
        initialVersesTags[verseTag.verse_key] = verseTag.tags_ids;
      });

      dispatch(tagsPageActions.setVersesTags(initialVersesTags));

      setLoadingState(false);
    }

    fetchSavedTags();
    dispatch(fetchVerseNotes());

    return () => {
      clientLeft = true;
    };
  }, []);

  if (loadingState) return <LoadingSpinner />;

  return (
    <Flex bgColor={"brand.bg"} overflow={"hidden"} maxH={"100%"} h={"100%"}>
      <TagsSide />
      {isVNotesLoading ? <LoadingSpinner /> : <TagsDisplay />}
    </Flex>
  );
}

export default Tags;
