import { useEffect, useReducer, useState } from "react";

import { selectedChaptersType } from "@/types";
import { IColor, IVerseColor, dbFuncs } from "@/util/db";
import useQuran from "@/context/useQuran";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/verseNotes";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import clReducer from "@/components/Coloring/clReducer";
import {
  clActions,
  stateProps,
  coloredProps,
} from "@/components/Coloring/consts";
import VersesSide from "@/components/Coloring/VersesSide";
import ChaptersSide from "@/components/Coloring/ChaptersSide";

function Coloring() {
  const quranService = useQuran();
  const [loadingState, setLoadingState] = useState(true);

  const dispatch = useAppDispatch();
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  useEffect(() => {
    dispatch(fetchVerseNotes());

    async function fetchData() {
      const savedColors: IColor[] = await dbFuncs.loadColors();

      const initialColors: coloredProps = {};

      savedColors.forEach((color) => {
        initialColors[color.id] = {
          colorID: color.id,
          colorDisplay: color.name,
          colorCode: color.code,
        };
      });

      dispatchClAction(clActions.setColorsList(initialColors));

      const savedVersesColor: IVerseColor[] = await dbFuncs.loadVersesColor();

      const initialColoredVerses: coloredProps = {};

      savedVersesColor.forEach((verseColor) => {
        initialColoredVerses[verseColor.verse_key] =
          initialColors[verseColor.color_id];
      });

      dispatchClAction(clActions.setColoredVerses(initialColoredVerses));

      setLoadingState(false);
    }
    if (localStorage.getItem("defaultColorsInitiated") === null) {
      const initialColors: coloredProps = {
        "0": { colorID: "0", colorCode: "#3dc23d", colorDisplay: "Studied" },
        "1": {
          colorID: "1",
          colorCode: "#dfdf58",
          colorDisplay: "In progress",
        },
        "2": { colorID: "2", colorCode: "#da5252", colorDisplay: "Unexplored" },
      };

      dispatchClAction(clActions.setColorsList(initialColors));

      Object.keys(initialColors).forEach((colorID) => {
        dbFuncs.saveColor({
          id: initialColors[colorID].colorID,
          name: initialColors[colorID].colorDisplay,
          code: initialColors[colorID].colorCode,
        });
      });

      localStorage.setItem("defaultColorsInitiated", "true");
      setLoadingState(false);
    } else {
      fetchData();
    }
  }, []);

  const initialSelectedChapters: selectedChaptersType = {};

  quranService.chapterNames.forEach((chapter) => {
    initialSelectedChapters[chapter.id] = true;
  });

  const initialState: stateProps = {
    currentChapter: 1,
    colorsList: {},
    selectedColors: {},
    coloredVerses: {},
    currentVerse: null,
    currentColor: null,
    selectedChapters: initialSelectedChapters,
    scrollKey: "",
  };

  const [state, dispatchClAction] = useReducer(clReducer, initialState);

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="coloring">
      <ChaptersSide
        currentChapter={state.currentChapter}
        colorsList={state.colorsList}
        currentColor={state.currentColor}
        coloredVerses={state.coloredVerses}
        selectedChapters={state.selectedChapters}
        dispatchClAction={dispatchClAction}
      />
      {isVNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <VersesSide
          selectedColors={state.selectedColors}
          coloredVerses={state.coloredVerses}
          currentChapter={state.currentChapter}
          colorsList={state.colorsList}
          currentVerse={state.currentVerse}
          selectedChapters={state.selectedChapters}
          scrollKey={state.scrollKey}
          dispatchClAction={dispatchClAction}
        />
      )}
    </div>
  );
}

export default Coloring;
