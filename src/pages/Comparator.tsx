import { useEffect, useState } from "react";

import { translationsProps } from "@/types";
import useQuran from "@/context/useQuran";
import {
  isVerseNotesLoading,
  isTransNotesLoading,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import { fetchAllTranslations } from "@/store/slices/global/translations";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { fetchTransNotes } from "@/store/slices/global/transNotes";
import { comparatorPageActions } from "@/store/slices/pages/comparator";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import Display from "@/components/Pages/Comparator/Display";
import Menu from "@/components/Pages/Comparator/Menu";

import { Box, Alert, AlertIcon, CloseButton, Spacer } from "@chakra-ui/react";

function Comparator() {
  const quranService = useQuran();

  const currentChapter = useAppSelector(
    (state) => state.comparatorPage.currentChapter
  );

  const currentVerse = useAppSelector(
    (state) => state.comparatorPage.currentVerse
  );

  const loading = useAppSelector((state) => state.translations.loading);

  const data = useAppSelector((state) => state.translations.data);

  const complete = useAppSelector((state) => state.translations.complete);

  const error = useAppSelector((state) => state.translations.error);

  const isVNotesLoading = useAppSelector(isVerseNotesLoading());
  const isTNotesLoading = useAppSelector(isTransNotesLoading());
  const dispatch = useAppDispatch();

  const [stateTrans, setStateTrans] = useState<translationsProps>(data);
  const [chapterVerses, setChapterVerses] = useState(() => {
    return quranService.getVerses(currentChapter);
  });

  useEffect(() => {
    dispatch(fetchVerseNotes());
    dispatch(fetchTransNotes());
  }, []);

  useEffect(() => {
    setChapterVerses(quranService.getVerses(currentChapter));
  }, [currentChapter]);

  useEffect(() => {
    if (complete) {
      setStateTrans(data);
    } else if (!loading) {
      dispatch(fetchAllTranslations());
    }
  }, [loading, complete, dispatch, data]);

  const selectVerse = (verseKey: string) => {
    dispatch(comparatorPageActions.setCurrentVerse(verseKey));
  };

  const setChapter = (chapterID: string) => {
    dispatch(comparatorPageActions.setCurrentChapter(chapterID));
  };

  if (error)
    return (
      <Box dir="auto" textAlign={"center"}>
        Failed to load translations, try reloading the page.
      </Box>
    );

  if (!complete) return <LoadingSpinner />;

  return (
    <Box bgColor={"var(--color-primary)"}>
      <Menu
        chapterVerses={chapterVerses}
        handleSelectVerse={selectVerse}
        handleSetChapter={setChapter}
      />
      <TransAlert />
      {isVNotesLoading || isTNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <Display
          currentChapter={currentChapter}
          currentVerse={currentVerse}
          chapterVerses={chapterVerses}
          transVerses={stateTrans}
          handleSelectVerse={selectVerse}
        />
      )}
    </Box>
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
    <Alert dir="auto" status="info">
      <AlertIcon />
      <strong>Note:</strong> Translations may not always fully capture the
      original meaning of the text. They are sincere attempts by their authors
      to comprehend the text based on their abilities and knowledge.
      Additionally, the accuracy of the translated version is inevitably
      influenced by semantic changes made to the original text prior to
      translation.
      <Spacer />
      <CloseButton onClick={onClickCloseAlert} />
    </Alert>
  );
};

export default Comparator;
