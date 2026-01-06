import { useEffect, useRef, useState } from "react";

import useQuran from "@/context/useQuran";
import { useTranslationsStore } from "@/store/zustand/translations";
import { useComparatorPageStore } from "@/store/pages/comparatorPage";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import Display from "@/components/Pages/Comparator/Display";
import Menu from "@/components/Pages/Comparator/Menu";

import { Alert, CloseButton, Spacer, Flex } from "@chakra-ui/react";
import { usePageNav } from "@/hooks/usePageNav";
import { ErrorRefresh } from "@/components/Generic/ErrorRefresh";

function Comparator() {
  usePageNav("nav.comparator");
  const refVerseList = useRef<HTMLDivElement>(null);
  const quranService = useQuran();

  const currentChapter = useComparatorPageStore(
    (state) => state.currentChapter
  );

  const currentVerse = useComparatorPageStore((state) => state.currentVerse);

  const {
    data: transData,
    complete,
    error,
    fetchTranslations,
  } = useTranslationsStore();

  const setCurrentVerse = useComparatorPageStore(
    (state) => state.setCurrentVerse
  );
  const setCurrentChapter = useComparatorPageStore(
    (state) => state.setCurrentChapter
  );

  const [chapterVerses, setChapterVerses] = useState(() => {
    return quranService.getVerses(currentChapter);
  });

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  useEffect(() => {
    setChapterVerses(quranService.getVerses(currentChapter));
  }, [quranService, currentChapter]);

  const selectVerse = (verseKey: string) => {
    setCurrentVerse(verseKey);

    /* 
    // To add once select onChange is called for the same value
    const node = refVerseList.current;

    if (!node || !currentVerse) return;

    const verseToHighlight = node.querySelector(
      `[data-id="${currentVerse}"]`
    ) as HTMLDivElement;

    if (verseToHighlight) {
      verseToHighlight.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    */
  };

  const setChapter = (chapterID: string) => {
    setCurrentChapter(chapterID);
  };

  if (error) return <ErrorRefresh message="Failed to load translations." />;

  if (!complete) return <LoadingSpinner text="Loading translations.." />;

  return (
    <Flex flexDirection={"column"} flex={1} bgColor={"brand.bg"}>
      <Menu
        chapterVerses={chapterVerses}
        handleSelectVerse={selectVerse}
        handleSetChapter={setChapter}
      />
      <TransAlert />
      <Display
        refVerseList={refVerseList}
        currentChapter={currentChapter}
        currentVerse={currentVerse}
        chapterVerses={chapterVerses}
        transVerses={transData}
        handleSelectVerse={selectVerse}
      />
    </Flex>
  );
}

const TransAlert = () => {
  const localStorageTransKey = "transNotified";

  const [transNotified, setTransNotified] = useState(
    localStorage.getItem(localStorageTransKey) !== null
  );

  function onClickCloseAlert() {
    localStorage.setItem(localStorageTransKey, "true");
    setTransNotified(true);
  }

  if (transNotified) return null;

  return (
    <Alert.Root dir="auto" status="info">
      <Alert.Indicator />
      <Alert.Content>
        <strong>Note:</strong> Translations may not always fully capture the
        original meaning of the text. They are sincere attempts by their authors
        to comprehend the text based on their abilities and knowledge.
        Additionally, the accuracy of the translated version is inevitably
        influenced by semantic changes made to the original text prior to
        translation.
      </Alert.Content>
      <Spacer />
      <CloseButton onClick={onClickCloseAlert} />
    </Alert.Root>
  );
};

export default Comparator;
