import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { verseProps } from "quran-tools";

import { Box, useBreakpointValue } from "@chakra-ui/react";

import VerseItem from "@/components/Pages/QuranBrowser/VerseItem";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { ChapterHeader } from "@/components/Generic/ChapterHeader";

const ListTitle = () => {
  const selectChapter = useAppSelector((state) => state.qbPage.selectChapter);
  const quranService = useQuran();
  const chapterName = quranService.getChapterName(selectChapter);

  const dispatch = useAppDispatch();
  const showSearchPanel = useAppSelector(
    (state) => state.qbPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.qbPage.showSearchPanelMobile
  );

  const isMobile = useBreakpointValue({ base: true, md: false });
  const isOpen = isMobile ? showSearchPanelMobile : showSearchPanel;

  const onTogglePanel = () => {
    dispatch(qbPageActions.setSearchPanel(!isOpen));
  };

  return (
    <ChapterHeader
      chapterName={chapterName}
      isOpen={isOpen}
      onTogglePanel={onTogglePanel}
    />
  );
};

const ListVerses = () => {
  return (
    <>
      <ListTitle />
      <ListBody />
    </>
  );
};

const ListBody = () => {
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  const scrollKey = useAppSelector((state) => state.qbPage.scrollKey);

  const selectChapter = useAppSelector((state) => state.qbPage.selectChapter);

  const refVerses = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startTransition(() => {
      setStateVerses(quranService.getVerses(selectChapter));
    });
  }, [selectChapter]);

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

  if (isPending) return <LoadingSpinner text="Loading verses..." />;

  return (
    <Box dir="rtl" py={1} px={"1rem"} ref={refVerses}>
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
