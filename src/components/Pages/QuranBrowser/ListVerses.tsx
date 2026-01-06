import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { useQuranBrowserPageStore } from "@/store/pages/quranBrowserPage";

import type { verseProps } from "quran-tools";

import { Box } from "@chakra-ui/react";

import { VerseItem } from "@/components/Pages/QuranBrowser/VerseItem";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { ChapterHeader } from "@/components/Custom/ChapterHeader";

const ListVerses = () => {
  return (
    <>
      <ListTitle />
      <ListBody />
    </>
  );
};

const ListTitle = () => {
  const selectChapter = useQuranBrowserPageStore(
    (state) => state.selectChapter
  );

  const showSearchPanel = useQuranBrowserPageStore(
    (state) => state.showSearchPanel
  );

  const showSearchPanelMobile = useQuranBrowserPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useQuranBrowserPageStore(
    (state) => state.setSearchPanel
  );

  const onTogglePanel = (state: boolean) => {
    setSearchPanel(state);
  };

  return (
    <ChapterHeader
      chapterID={selectChapter}
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
    />
  );
};

const ListBody = () => {
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  const scrollKey = useQuranBrowserPageStore((state) => state.scrollKey);

  const selectChapter = useQuranBrowserPageStore(
    (state) => state.selectChapter
  );

  const refVerses = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startTransition(() => {
      setStateVerses(quranService.getVerses(selectChapter));
    });
  }, [selectChapter, quranService]);

  useEffect(() => {
    if (scrollKey && refVerses.current) {
      const verseToHighlight = refVerses.current.querySelector(
        `[data-id="${scrollKey}"]`
      ) as HTMLDivElement;

      if (verseToHighlight) {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [scrollKey, isPending]);

  if (isPending) return <LoadingSpinner text="Loading verses.." />;

  return (
    <Box
      dir="rtl"
      py={1}
      px={"0.5rem"}
      smDown={{ px: "0.2rem" }}
      ref={refVerses}
    >
      {stateVerses.map((verse: verseProps) => (
        <VerseItem
          key={verse.key}
          verse={verse}
          isSelected={scrollKey === verse.key}
        />
      ))}
    </Box>
  );
};

export default ListVerses;
