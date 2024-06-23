import { useEffect, memo, useCallback } from "react";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { lettersPageActions } from "@/store/slices/pages/letters";

import Display from "@/components/Pages/Letters/Display";
import ChaptersList from "@/components/Custom/ChaptersList";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

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

    const handleSelectChapter = useCallback((chapterID: number) => {
      dispatch(lettersPageActions.setCurrentChapter(chapterID));
      dispatch(lettersPageActions.setScrollKey(""));
    }, []);

    useEffect(() => {
      dispatch(fetchVerseNotes());
    }, []);

    return (
      <div className="panel-quran">
        <div className="side">
          <ChaptersList
            selectChapter={currentChapter}
            handleChapterChange={handleSelectChapter}
            mainClass="side-chapters"
            inputClass="side-chapters-input"
            selectClass="side-chapters-list"
          />
        </div>
        {isVNotesLoading ? <LoadingSpinner /> : <Display />}
      </div>
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
