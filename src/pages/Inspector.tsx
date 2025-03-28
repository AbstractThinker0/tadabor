import { useEffect, useState } from "react";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { inspectorPageActions } from "@/store/slices/pages/inspector";

import useQuran from "@/context/useQuran";

import ChaptersList from "@/components/Custom/ChaptersList";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import Display from "@/components/Pages/Inspector/Display";

import { Flex } from "@chakra-ui/react";

function Inspector() {
  const quranService = useQuran();
  const dispatch = useAppDispatch();

  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  const currentChapter = useAppSelector(
    (state) => state.inspectorPage.currentChapter
  );

  const [rootsLoaded, setRootsLoaded] = useState(
    quranService.isRootsDataLoaded
  );

  useEffect(() => {
    const handleRootsLoaded = () => {
      setRootsLoaded(true);
    };

    quranService.onRootsLoaded(handleRootsLoaded);

    return () => {
      quranService.onRootsLoaded(() => {}); // Reset callback
    };
  }, []);

  function handleSelectChapter(chapterID: string) {
    dispatch(inspectorPageActions.setCurrentChapter(chapterID));
    dispatch(inspectorPageActions.setScrollKey(""));
  }

  useEffect(() => {
    dispatch(fetchVerseNotes());
  }, []);

  return (
    <Flex
      bgColor={"brand.bg"}
      overflow={"hidden"}
      maxH={"100%"}
      height={"100%"}
    >
      <Flex
        paddingInlineStart={"10px"}
        paddingInlineEnd={"1px"}
        paddingTop={"5px"}
      >
        <ChaptersList
          selectChapter={currentChapter}
          handleChapterChange={handleSelectChapter}
        />
      </Flex>
      {isVNotesLoading || !rootsLoaded ? (
        <LoadingSpinner />
      ) : (
        <Display currentChapter={currentChapter} />
      )}
    </Flex>
  );
}

export default Inspector;
