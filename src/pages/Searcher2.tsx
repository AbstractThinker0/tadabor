import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";

import { searcher2PageActions } from "@/store/slices/pages/searcher2";

import useQuran from "@/context/useQuran";
import type { verseMatchResult } from "quran-tools";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import PanelQuran from "@/components/Custom/PanelQuran";

import { Box, Flex, HStack, Span, Spinner, Tabs } from "@chakra-ui/react";

import { Checkbox } from "@/components/ui/checkbox";

import { ButtonVerse } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import { InputString } from "@/components/Generic/Input";

import { usePageNav } from "@/hooks/usePageNav";

const Searcher2 = () => {
  usePageNav("nav_searcher2");
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const verseTab = useAppSelector((state) => state.searcher2Page.verseTab);

  const tabIndex = useAppSelector((state) => state.searcher2Page.tabIndex);

  const scrollKey = useAppSelector((state) => state.searcher2Page.scrollKey);

  const setScrollKey = (key: string) => {
    dispatch(searcher2PageActions.setScrollKey(key));
  };

  const onChangeTab = (index: string) => {
    dispatch(searcher2PageActions.setTabIndex(index));
  };

  return (
    <Tabs.Root
      colorPalette={"blue"}
      value={tabIndex}
      onValueChange={(e) => onChangeTab(e.value)}
      bgColor={"brand.bg"}
      overflow="hidden"
      maxH="100%"
      h="100%"
      display={"flex"}
      flexDirection={"column"}
      lazyMount
      unmountOnExit
    >
      <Tabs.List>
        <Tabs.Trigger value="searcherTab">{t("searcher_search")}</Tabs.Trigger>
        <Tabs.Trigger value="verseTab" hidden={!verseTab}>
          {verseTab}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content
        overflow="hidden"
        maxH="100%"
        h="100%"
        display={"flex"}
        flexDirection={"column"}
        value="searcherTab"
      >
        <Searcher2Tab />
      </Tabs.Content>

      <Tabs.Content
        overflow="hidden"
        maxH="100%"
        h="100%"
        display={"flex"}
        flexDirection={"column"}
        value="verseTab"
      >
        <PanelQuran
          verseKey={verseTab}
          scrollKey={scrollKey}
          setScrollKey={setScrollKey}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
};

const Searcher2Tab = () => {
  const quranService = useQuran();

  const [isPending, startTransition] = useTransition();
  const [isPendingLoad, startLoadTransition] = useTransition();
  const [stateVerses, setStateVerses] = useState<verseMatchResult[]>([]);
  const [itemsCount, setItemsCount] = useState(80);

  const refVerses = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const scrollKey = useAppSelector((state) => state.searcher2Page.scrollKey);

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

  const searchStringHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(searcher2PageActions.setSearchString(event.target.value));
  };

  const onClearInput = () => {
    dispatch(searcher2PageActions.setSearchString(""));
  };

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    if (itemsCount >= stateVerses.length || isPending) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      startTransition(() => {
        setItemsCount((state) => Math.min(state + 15, stateVerses.length));
      });
    }
  }

  const handleCheckboxDiacritics = (checked: boolean) => {
    dispatch(searcher2PageActions.setSearchDiacritics(checked));
  };

  const handleCheckboxIdentical = (checked: boolean) => {
    dispatch(searcher2PageActions.setSearchIdentical(checked));
  };

  const handleCheckboxStart = (checked: boolean) => {
    dispatch(searcher2PageActions.setSearchStart(checked));
  };

  useEffect(() => {
    startLoadTransition(() => {
      const result = quranService.searchByWord(searchString, "all", {
        searchDiacritics,
        searchIdentical,
        searchStart,
      });

      setStateVerses(result || []);
    });
  }, [
    searchString,
    searchIdentical,
    searchDiacritics,
    searchStart,
    quranService,
  ]);

  useEffect(() => {
    if (refVerses.current && scrollKey) {
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
  }, [scrollKey]);

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
          <InputString
            value={searchString}
            onChange={searchStringHandle}
            onClear={onClearInput}
            dir="rtl"
          />
          <span>({stateVerses.length})</span>
        </Flex>
        <Flex p={1} gap={1}>
          <Flex fontWeight={"bold"} flexShrink={0} lineHeight={"short"}>
            {t("search_options")}
          </Flex>
          <HStack gap={3} flexWrap={"wrap"}>
            <Checkbox
              checked={searchDiacritics}
              onCheckedChange={(e) => handleCheckboxDiacritics(!!e.checked)}
            >
              {t("search_diacritics")}
            </Checkbox>
            <Checkbox
              checked={searchIdentical}
              onCheckedChange={(e) => handleCheckboxIdentical(!!e.checked)}
            >
              {t("search_identical")}
            </Checkbox>
            <Checkbox
              checked={searchStart}
              onCheckedChange={(e) => handleCheckboxStart(!!e.checked)}
            >
              {t("search_start")}
            </Checkbox>
          </HStack>
        </Flex>
      </Flex>
      <Box
        margin={"0.5rem"}
        smDown={{ margin: "0.25rem" }}
        overflow={"hidden"}
        maxH={"100%"}
        height={"100%"}
        border={"1px solid"}
        borderColor={"gray.emphasized"}
        borderRadius={"1rem"}
      >
        <Box
          maxH={"100%"}
          height={"100%"}
          padding={"1rem"}
          smDown={{ padding: "0.5rem" }}
          overflowY={"auto"}
          dir="rtl"
          onScroll={handleScroll}
          ref={refVerses}
        >
          {isPendingLoad ? (
            <LoadingSpinner text="Loading verses.." />
          ) : (
            stateVerses
              .slice(0, itemsCount)
              .map((verseMatch, index) => (
                <VerseItem
                  index={index}
                  key={verseMatch.key}
                  verseMatch={verseMatch}
                  isSelected={scrollKey === verseMatch.key}
                />
              ))
          )}
          {isPending && (
            <Box width={"100%"} textAlign={"center"} py={5}>
              <Spinner
                size="sm"
                borderWidth="2px"
                margin="auto"
                color="blue.500"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

interface VerseItemProps {
  index: number;
  verseMatch: verseMatchResult;
  isSelected: boolean;
}

const VerseItem = ({ verseMatch, isSelected, index }: VerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const onClickVerseChapter = () => {
    dispatch(searcher2PageActions.setVerseTab(verseMatch.key));
    dispatch(searcher2PageActions.setScrollKey(verseMatch.key));
  };

  const onClickVerse = () => {
    if (isSelected) {
      dispatch(searcher2PageActions.setScrollKey(""));
    } else {
      dispatch(searcher2PageActions.setScrollKey(verseMatch.key));
    }
  };

  return (
    <BaseVerseItem verseKey={verseMatch.key} isSelected={isSelected}>
      <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
        {index + 1}.
      </Span>{" "}
      <VerseHighlightMatches verse={verseMatch} /> (
      <ButtonVerse onClick={onClickVerseChapter}>
        {quranService.getChapterName(verseMatch.suraid)}
      </ButtonVerse>
      :<ButtonVerse onClick={onClickVerse}>{verseMatch.verseid}</ButtonVerse>)
    </BaseVerseItem>
  );
};

export default Searcher2;
