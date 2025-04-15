import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { verseProps } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseItem from "@/components/Pages/QuranBrowser/VerseItem";
import { Box, Flex } from "@chakra-ui/react";

import { GoSidebarExpand } from "react-icons/go";
import { GoSidebarCollapse } from "react-icons/go";

interface ListTitleProps {
  chapterName: string;
}

const ListTitle = ({ chapterName }: ListTitleProps) => {
  const dispatch = useAppDispatch();

  const showSearchPanel = useAppSelector(
    (state) => state.qbPage.showSearchPanel
  );

  const onTogglePanel = () => {
    dispatch(qbPageActions.setSearchPanel(!showSearchPanel));
  };

  return (
    <Flex
      bgColor="bg.muted"
      py={3}
      px={4}
      border="1px solid"
      borderColor="border.emphasized"
      align="center"
      justifyContent={"center"}
      position="relative"
      borderTopRadius={"l2"}
    >
      <Box
        onClick={onTogglePanel}
        position="absolute"
        insetInlineStart="0.5rem"
        fontSize={"3xl"}
        cursor={"pointer"}
      >
        {showSearchPanel ? <GoSidebarCollapse /> : <GoSidebarExpand />}
      </Box>

      <Flex
        flex="1"
        justify="center"
        fontSize="3xl"
        fontWeight="medium"
        color="blue.focusRing"
      >
        سورة {chapterName}
      </Flex>
    </Flex>
  );
};

const ListVerses = () => {
  const selectChapter = useAppSelector((state) => state.qbPage.selectChapter);
  const quranService = useQuran();
  const chapterName = quranService.getChapterName(selectChapter);

  return (
    <>
      <ListTitle chapterName={chapterName} />
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
