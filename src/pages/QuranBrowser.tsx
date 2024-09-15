import SearchPanel from "@/components/Pages/QuranBrowser/SearchPanel";
import DisplayPanel from "@/components/Pages/QuranBrowser/DisplayPanel";

import { Flex } from "@chakra-ui/react";

function QuranBrowser() {
  return (
    <Flex bgColor="var(--color-primary)" overflow="hidden" maxH="100%" h="100%">
      <SearchPanel />
      <DisplayPanel />
    </Flex>
  );
}

export default QuranBrowser;
