import { useEffect, useReducer } from "react";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/verseNotes";

import ChaptersList from "@/components/Custom/ChaptersList";
import Display from "@/components/Inspector/Display";
import isReducer from "@/components/Inspector/isReducer";
import { stateProps, isActions } from "@/components/Inspector/consts";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

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
