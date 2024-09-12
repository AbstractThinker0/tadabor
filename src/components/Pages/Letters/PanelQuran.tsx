import { useEffect, memo, useCallback } from "react";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { lettersPageActions } from "@/store/slices/pages/letters";

import Display from "@/components/Pages/Letters/Display";
import ChaptersList from "@/components/Custom/ChaptersList";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { Flex } from "@chakra-ui/react";

interface PanelQuranProps {
  isVisible: boolean;
}

const PanelQuran = memo(
  ({ isVisible }: PanelQuranProps) => {
    const dispatch = useAppDispatch();
    const currentChapter = useAppSelector(
      (state) => state.lettersPage.currentChapter
    );

    const isVNotesLoading = useAppSelector(isVerseNotesLoading());

    const handleSelectChapter = useCallback((chapterID: string) => {
      dispatch(lettersPageActions.setCurrentChapter(chapterID));
      dispatch(lettersPageActions.setScrollKey(""));
    }, []);

    useEffect(() => {
      dispatch(fetchVerseNotes());
    }, []);

    return (
      <Flex overflow={"hidden"} maxH={"100%"} height={"100%"}>
        <Flex padding={1}>
          <ChaptersList
            selectChapter={currentChapter}
            handleChapterChange={handleSelectChapter}
          />
        </Flex>
        {isVNotesLoading ? <LoadingSpinner /> : <Display />}
      </Flex>
    );
  },
  (prevProps, nextProps) => {
    if (
      nextProps.isVisible === false &&
      prevProps.isVisible === nextProps.isVisible
    ) {
      return true;
    }
    return false;
  }
);

PanelQuran.displayName = "PanelQuran";

export default PanelQuran;
