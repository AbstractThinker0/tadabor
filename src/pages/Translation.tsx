import { useEffect } from "react";

import { isTransNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchTransNotes } from "@/store/slices/global/transNotes";
import { translationPageActions } from "@/store/slices/pages/translation";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import ChaptersList from "@/components/Custom/ChaptersList";
import DisplayPanel from "@/components/Pages/Translation/DisplayPanel";

import { Flex } from "@chakra-ui/react";
import { usePageNav } from "@/components/Custom/usePageNav";

const Translation = () => {
  usePageNav("nav_translation");
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
      bgColor={"brand.bg"}
      overflow={"hidden"}
      maxH={"100%"}
      height={"100%"}
    >
      <Flex padding={1}>
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
