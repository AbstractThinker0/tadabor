import { useEffect, useState } from "react";

import { type IColor, type IVerseColor, dbFuncs } from "@/util/db";

import { useColoringPageStore } from "@/store/zustand/coloringPage";

import { Sidebar } from "@/components/Generic/Sidebar";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import type { coloredProps } from "@/components/Pages/Coloring/consts";
import VersesSide from "@/components/Pages/Coloring/VersesSide";
import ChaptersSide from "@/components/Pages/Coloring/ChaptersSide";
import { Flex } from "@chakra-ui/react";
import { usePageNav } from "@/hooks/usePageNav";

function Coloring() {
  usePageNav("nav.coloring");
  const [loadingState, setLoadingState] = useState(true);

  const colorsList = useColoringPageStore((state) => state.colorsList);
  const setColorsList = useColoringPageStore((state) => state.setColorsList);
  const setColoredVerses = useColoringPageStore(
    (state) => state.setColoredVerses
  );

  useEffect(() => {
    async function fetchSavedColors() {
      // Check if we already fetched colors
      if (Object.keys(colorsList).length) {
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

      setColorsList(initialColors);

      const savedVersesColor: IVerseColor[] = await dbFuncs.loadVersesColor();

      const initialColoredVerses: coloredProps = {};

      savedVersesColor.forEach((verseColor) => {
        initialColoredVerses[verseColor.verse_key] =
          initialColors[verseColor.color_id];
      });

      setColoredVerses(initialColoredVerses);

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

      setColorsList(initialColors);

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
  }, [colorsList, setColorsList, setColoredVerses]);

  const showSearchPanel = useColoringPageStore(
    (state) => state.showSearchPanel
  );

  const showSearchPanelMobile = useColoringPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useColoringPageStore((state) => state.setSearchPanel);

  const setOpenState = (state: boolean) => {
    setSearchPanel(state);
  };

  if (loadingState) return <LoadingSpinner text="Loading colors data.." />;

  return (
    <Flex overflow={"hidden"} maxH={"100%"} h={"100%"} bgColor={"brand.bg"}>
      <Sidebar
        isOpenMobile={showSearchPanelMobile}
        isOpenDesktop={showSearchPanel}
        setOpenState={setOpenState}
      >
        <ChaptersSide />
      </Sidebar>
      <VersesSide />
    </Flex>
  );
}

export default Coloring;
