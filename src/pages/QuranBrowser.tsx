import SearchPanel from "@/components/Pages/QuranBrowser/SearchPanel";
import DisplayPanel from "@/components/Pages/QuranBrowser/DisplayPanel";

import { Flex } from "@chakra-ui/react";
import { usePageNav } from "@/hooks/usePageNav";

function QuranBrowser() {
  usePageNav("nav_browser");

  return (
    <Flex bgColor="brand.bg" overflow="hidden" maxH="100%" h="100%">
      <SearchPanel />
      <DisplayPanel />
    </Flex>
  );
}

export default QuranBrowser;
