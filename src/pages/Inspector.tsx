import { useEffect } from "react";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { inspectorPageActions } from "@/store/slices/pages/inspector";

import ChaptersList from "@/components/Custom/ChaptersList";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import Display from "@/components/Pages/Inspector/Display";

import { Flex } from "@chakra-ui/react";

function Inspector() {
  const dispatch = useAppDispatch();

  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  const currentChapter = useAppSelector(
    (state) => state.inspectorPage.currentChapter
  );

  function handleSelectChapter(chapterID: string) {
    dispatch(inspectorPageActions.setCurrentChapter(chapterID));
    dispatch(inspectorPageActions.setScrollKey(""));
  }

  useEffect(() => {
    dispatch(fetchVerseNotes());
  }, []);

  return (
    <Flex
      bgColor={"var(--color-primary)"}
      overflow={"hidden"}
      maxH={"100%"}
      height={"100%"}
    >
      <Flex
        paddingInlineStart={"10px"}
        paddingInlineEnd={"1px"}
        paddingTop={"5px"}
      >
        <ChaptersList
          selectChapter={currentChapter}
          handleChapterChange={handleSelectChapter}
        />
      </Flex>
      {isVNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <Display currentChapter={currentChapter} />
      )}
    </Flex>
  );
}

export default Inspector;
