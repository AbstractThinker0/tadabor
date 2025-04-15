import { useAppSelector } from "@/store";

import { Collapsible, Flex } from "@chakra-ui/react";

import SearchPanel from "@/components/Pages/QuranBrowser/SearchPanel";
import DisplayPanel from "@/components/Pages/QuranBrowser/DisplayPanel";

import { usePageNav } from "@/hooks/usePageNav";

function QuranBrowser() {
  usePageNav("nav_browser");

  const showSearchPanel = useAppSelector(
    (state) => state.qbPage.showSearchPanel
  );

  return (
    <Flex bgColor="brand.bg" overflow="hidden" maxH="100%" h="100%">
      <Collapsible.Root open={showSearchPanel} lazyMount unmountOnExit>
        <Collapsible.Content>
          <SearchPanel />
        </Collapsible.Content>
      </Collapsible.Root>
      <DisplayPanel />
    </Flex>
  );
}

export default QuranBrowser;
