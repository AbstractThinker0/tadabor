import { useEffect } from "react";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { inspectorPageActions } from "@/store/slices/pages/inspector";

import ChaptersList from "@/components/Custom/ChaptersList";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import Display from "@/components/Pages/Inspector/Display";

import "@/styles/pages/inspector.scss";

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
    <div className="inspector">
      <div className="side">
        <ChaptersList
          selectChapter={currentChapter}
          handleChapterChange={handleSelectChapter}
          mainClass="side-chapters"
          inputClass="side-chapters-input"
          selectClass="side-chapters-list"
        />
      </div>
      {isVNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <Display currentChapter={currentChapter} />
      )}
    </div>
  );
}

export default Inspector;
