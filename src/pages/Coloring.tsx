import { useEffect, useState } from "react";

import { IColor, IVerseColor, dbFuncs } from "@/util/db";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";

import { coloringPageActions } from "@/store/slices/pages/coloring";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { coloredProps } from "@/components/Pages/Coloring/consts";
import VersesSide from "@/components/Pages/Coloring/VersesSide";
import ChaptersSide from "@/components/Pages/Coloring/ChaptersSide";

function Coloring() {
  const [loadingState, setLoadingState] = useState(true);

  const dispatch = useAppDispatch();
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());
  const coloringState = useAppSelector((state) => state.coloringPage);

  useEffect(() => {
    dispatch(fetchVerseNotes());

    async function fetchSavedColors() {
      // Check if we already fetched colors
      if (Object.keys(coloringState.colorsList).length) {
        setLoadingState(false);
        return;
      }

      const savedColors: IColor[] = await dbFuncs.loadColors();

      const initialColors: coloredProps = {};

      savedColors.forEach((color) => {
        initialColors[color.id] = {
          colorID: color.id,
          colorDisplay: color.name,
          colorCode: color.code,
        };
      });

      dispatch(coloringPageActions.setColorsList(initialColors));

      const savedVersesColor: IVerseColor[] = await dbFuncs.loadVersesColor();

      const initialColoredVerses: coloredProps = {};

      savedVersesColor.forEach((verseColor) => {
        initialColoredVerses[verseColor.verse_key] =
          initialColors[verseColor.color_id];
      });

      dispatch(coloringPageActions.setColoredVerses(initialColoredVerses));

      setLoadingState(false);
    }

    function loadDefaultColors() {
      const initialColors: coloredProps = {
        "0": { colorID: "0", colorCode: "#3dc23d", colorDisplay: "Studied" },
        "1": {
          colorID: "1",
          colorCode: "#dfdf58",
          colorDisplay: "In progress",
        },
        "2": { colorID: "2", colorCode: "#da5252", colorDisplay: "Unexplored" },
      };

      dispatch(coloringPageActions.setColorsList(initialColors));

      Object.keys(initialColors).forEach((colorID) => {
        dbFuncs.saveColor({
          id: initialColors[colorID].colorID,
          name: initialColors[colorID].colorDisplay,
          code: initialColors[colorID].colorCode,
        });
      });

      localStorage.setItem("defaultColorsInitiated", "true");
      setLoadingState(false);
    }

    // Check if first time opening colors page
    if (localStorage.getItem("defaultColorsInitiated") === null) {
      loadDefaultColors();
    } else {
      fetchSavedColors();
    }
  }, []);

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="coloring">
      <ChaptersSide />
      {isVNotesLoading ? <LoadingSpinner /> : <VersesSide />}
    </div>
  );
}

export default Coloring;
