import { useEffect } from "react";

import { isTransNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchTransNotes } from "@/store/slices/global/transNotes";
import { translationPageActions } from "@/store/slices/pages/translation";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import ChaptersList from "@/components/Custom/ChaptersList";
import DisplayPanel from "@/components/Pages/Translation/DisplayPanel";

import { Flex } from "@chakra-ui/react";

const Translation = () => {
  const dispatch = useAppDispatch();

  const isTNotesLoading = useAppSelector(isTransNotesLoading());

  const currentChapter = useAppSelector(
    (state) => state.translationPage.currentChapter
  );

  useEffect(() => {
    dispatch(fetchTransNotes());
  }, []);

  const handleChapterChange = (chapter: string) => {
    dispatch(translationPageActions.setCurrentChapter(chapter));
  };

  return (
    <Flex
      backgroundColor={"var(--color-primary)"}
      overflow={"hidden"}
      maxH={"100%"}
      h={"100%"}
    >
      <Flex flexDir={"column"} padding={1}>
        <ChaptersList
          handleChapterChange={handleChapterChange}
          selectChapter={currentChapter}
        />
      </Flex>
      {isTNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <DisplayPanel selectChapter={currentChapter} />
      )}
    </Flex>
  );
};

export default Translation;
