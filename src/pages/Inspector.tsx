import { useEffect, useReducer } from "react";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";

import ChaptersList from "@/components/Custom/ChaptersList";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import Display from "@/components/Pages/Inspector/Display";
import isReducer from "@/components/Pages/Inspector/isReducer";
import { stateProps, isActions } from "@/components/Pages/Inspector/consts";

import "@/styles/pages/inspector.scss";

function Inspector() {
  const dispatch = useAppDispatch();
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  const initialState: stateProps = {
    currentChapter: 1,
    scrollKey: "",
  };

  const [state, dispatchIsAction] = useReducer(isReducer, initialState);

  function handleSelectChapter(chapterID: number) {
    dispatchIsAction(isActions.setChapter(chapterID));
  }

  useEffect(() => {
    dispatch(fetchVerseNotes());
  }, []);

  return (
    <div className="inspector">
      <div className="side">
        <ChaptersList
          selectChapter={state.currentChapter}
          handleChapterChange={handleSelectChapter}
          mainClass="side-chapters"
          inputClass="side-chapters-input"
          selectClass="side-chapters-list"
        />
      </div>
      {isVNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <Display
          currentChapter={state.currentChapter}
          dispatchIsAction={dispatchIsAction}
          scrollKey={state.scrollKey}
        />
      )}
    </div>
  );
}

export default Inspector;
