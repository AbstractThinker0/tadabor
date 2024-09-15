import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { searcher2PageActions } from "@/store/slices/pages/searcher2";

import useQuran from "@/context/useQuran";
import { verseMatchResult } from "@/types";

import VerseContainer from "@/components/Custom/VerseContainer";

import PanelQuran from "@/components/Custom/PanelQuran";

import {
  Box,
  Flex,
  Input,
  Tab,
  TabList,
  Checkbox,
  useBoolean,
} from "@chakra-ui/react";

import {
  TabContent,
  TabsContainer,
  TabsPanels,
} from "@/components/Generic/Tabs";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";
import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";

const Searcher2 = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const verseTab = useAppSelector((state) => state.searcher2Page.verseTab);

  const tabIndex = useAppSelector((state) => state.searcher2Page.tabIndex);

  const scrollKey = useAppSelector((state) => state.searcher2Page.scrollKey);

  useEffect(() => {
    dispatch(fetchVerseNotes());
  }, []);

  const setScrollKey = (key: string) => {
    dispatch(searcher2PageActions.setScrollKey(key));
  };

  const onChangeTab = (index: number) => {
    dispatch(searcher2PageActions.setTabIndex(index));
  };

  return (
    <TabsContainer onChange={onChangeTab} index={tabIndex} isLazy>
      <TabList>
        <Tab>{t("searcher_search")}</Tab>
        <Tab hidden={!verseTab}>{verseTab}</Tab>
      </TabList>
      <TabsPanels>
        <TabContent>
          <Searcher2Tab />
        </TabContent>
        <TabContent>
          <PanelQuran
            verseKey={verseTab}
            scrollKey={scrollKey}
            setScrollKey={setScrollKey}
          />
        </TabContent>
      </TabsPanels>
    </TabsContainer>
  );
};

const Searcher2Tab = () => {
  const quranService = useQuran();

  const [isPending, startTransition] = useTransition();
  const [stateVerses, setStateVerses] = useState<verseMatchResult[]>([]);
  const [itemsCount, setItemsCount] = useState(80);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const searchString = useAppSelector(
    (state) => state.searcher2Page.searchString
  );

  const searchIdentical = useAppSelector(
    (state) => state.searcher2Page.searchIdentical
  );

  const searchDiacritics = useAppSelector(
    (state) => state.searcher2Page.searchDiacritics
  );

  const searchStart = useAppSelector(
    (state) => state.searcher2Page.searchStart
  );

  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  const searchStringHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(searcher2PageActions.setSearchString(event.target.value));
  };

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setItemsCount((state) => state + 15);
    }
  }

  const handleCheckboxDiacritics = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(searcher2PageActions.setSearchDiacritics(event.target.checked));
  };

  const handleCheckboxIdentical = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(searcher2PageActions.setSearchIdentical(event.target.checked));
  };

  const handleCheckboxStart = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(searcher2PageActions.setSearchStart(event.target.checked));
  };

  useEffect(() => {
    startTransition(() => {
      const result = quranService.searchByWord(searchString, "all", {
        searchDiacritics,
        searchIdentical,
        searchStart,
      });

      setStateVerses(result || []);
    });
  }, [searchString, searchIdentical, searchDiacritics, searchStart]);

  return (
    <Flex
      flexDir={"column"}
      overflow={"hidden"}
      paddingTop={"10px"}
      maxH={"100%"}
      height={"100%"}
    >
      <Flex flexDir={"column"} alignItems={"center"}>
        <Flex alignItems={"center"} gap={1}>
          <Input
            bgColor={"white"}
            type="search"
            placeholder=""
            value={searchString}
            aria-label="Search"
            onChange={searchStringHandle}
            required
            dir="rtl"
          />
          <span>({stateVerses.length})</span>
        </Flex>
        <Flex gap={1}>
          <Box as="span" fontWeight={"bold"}>
            {t("search_options")}
          </Box>
          <Checkbox
            isChecked={searchDiacritics}
            onChange={handleCheckboxDiacritics}
          >
            {t("search_diacritics")}
          </Checkbox>
          <Checkbox
            isChecked={searchIdentical}
            onChange={handleCheckboxIdentical}
          >
            {t("search_identical")}
          </Checkbox>
          <Checkbox isChecked={searchStart} onChange={handleCheckboxStart}>
            {t("search_start")}
          </Checkbox>
        </Flex>
      </Flex>
      <Box
        margin={"0.5rem"}
        overflow={"hidden"}
        maxH={"100%"}
        height={"100%"}
        border={"1px solid gray"}
        borderRadius={"1rem"}
      >
        <Box
          maxH={"100%"}
          height={"100%"}
          padding={"1rem"}
          overflowY={"auto"}
          dir="rtl"
          onScroll={handleScroll}
        >
          {isPending || isVNotesLoading ? (
            <LoadingSpinner />
          ) : (
            stateVerses
              .slice(0, itemsCount)
              .map((verseMatch) => (
                <VerseItem key={verseMatch.key} verseMatch={verseMatch} />
              ))
          )}
        </Box>
      </Box>
    </Flex>
  );
};

interface VerseItemProps {
  verseMatch: verseMatchResult;
}

const VerseItem = ({ verseMatch }: VerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();
  const [isOpen, setOpen] = useBoolean();

  const onClickVerse = () => {
    dispatch(searcher2PageActions.setVerseTab(verseMatch.key));
    dispatch(searcher2PageActions.setScrollKey(verseMatch.key));
  };

  return (
    <Box py={"4px"} borderBottom={"1px solid #dee2e6"}>
      <VerseContainer>
        <VerseHighlightMatches verse={verseMatch} />
        <ButtonVerse onClick={onClickVerse}>{` (${quranService.getChapterName(
          verseMatch.suraid
        )}:${verseMatch.verseid})`}</ButtonVerse>
        <ButtonExpand onClick={setOpen.toggle} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verseMatch.key} />
    </Box>
  );
};

export default Searcher2;
