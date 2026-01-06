import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { useSearcher2PageStore } from "@/store/pages/searcher2Page";

import useQuran from "@/context/useQuran";
import type { verseMatchResult } from "quran-tools";

import PanelQuran from "@/components/Custom/PanelQuran";

import { Box, Flex, HStack, Spinner, Tabs } from "@chakra-ui/react";

import { Checkbox } from "@/components/ui/checkbox";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { InputString } from "@/components/Generic/Input";

import { usePageNav } from "@/hooks/usePageNav";

import { VerseItem } from "@/components/Pages/Searcher2/VerseItem";

const Searcher2 = () => {
  usePageNav("nav.searcher2");
  const { t } = useTranslation();
  const verseTab = useSearcher2PageStore((state) => state.verseTab);
  const tabIndex = useSearcher2PageStore((state) => state.tabIndex);
  const scrollKey = useSearcher2PageStore((state) => state.scrollKey);
  const setScrollKey = useSearcher2PageStore((state) => state.setScrollKey);
  const setTabIndex = useSearcher2PageStore((state) => state.setTabIndex);

  return (
    <Tabs.Root
      colorPalette={"blue"}
      value={tabIndex}
      onValueChange={(e) => setTabIndex(e.value)}
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
  const scrollKey = useSearcher2PageStore((state) => state.scrollKey);
  const searchString = useSearcher2PageStore((state) => state.searchString);
  const searchIdentical = useSearcher2PageStore(
    (state) => state.searchIdentical
  );
  const searchDiacritics = useSearcher2PageStore(
    (state) => state.searchDiacritics
  );
  const searchStart = useSearcher2PageStore((state) => state.searchStart);
  const setSearchString = useSearcher2PageStore(
    (state) => state.setSearchString
  );
  const setSearchDiacritics = useSearcher2PageStore(
    (state) => state.setSearchDiacritics
  );
  const setSearchIdentical = useSearcher2PageStore(
    (state) => state.setSearchIdentical
  );
  const setSearchStart = useSearcher2PageStore((state) => state.setSearchStart);

  const searchStringHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const onClearInput = () => {
    setSearchString("");
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
    setSearchDiacritics(checked);
  };

  const handleCheckboxIdentical = (checked: boolean) => {
    setSearchIdentical(checked);
  };

  const handleCheckboxStart = (checked: boolean) => {
    setSearchStart(checked);
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
            {t("search.options")}
          </Flex>
          <HStack gap={3} flexWrap={"wrap"}>
            <Checkbox
              checked={searchDiacritics}
              onCheckedChange={(e) => handleCheckboxDiacritics(!!e.checked)}
            >
              {t("search.diacritics")}
            </Checkbox>
            <Checkbox
              checked={searchIdentical}
              onCheckedChange={(e) => handleCheckboxIdentical(!!e.checked)}
            >
              {t("search.identical")}
            </Checkbox>
            <Checkbox
              checked={searchStart}
              onCheckedChange={(e) => handleCheckboxStart(!!e.checked)}
            >
              {t("search.start")}
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

export default Searcher2;
