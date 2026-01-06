import { useEffect, useRef } from "react";

import { useInspectorPageStore } from "@/store/zustand/inspectorPage";

import { ChapterHeader } from "@/components/Custom/ChapterHeader";

import ListVerses from "@/components/Pages/Inspector/ListVerses";
import { Box, Flex } from "@chakra-ui/react";

const ListTitle = () => {
  const selectChapter = useInspectorPageStore((state) => state.currentChapter);

  const showSearchPanel = useInspectorPageStore(
    (state) => state.showSearchPanel
  );

  const showSearchPanelMobile = useInspectorPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useInspectorPageStore((state) => state.setSearchPanel);

  const onTogglePanel = (state: boolean) => {
    setSearchPanel(state);
  };

  return (
    <ChapterHeader
      chapterID={Number(selectChapter)}
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
    />
  );
};

interface DisplayProps {
  currentChapter: string;
}

const Display = ({ currentChapter }: DisplayProps) => {
  const refDisplay = useRef<HTMLDivElement>(null);

  // Reset scroll whenever we switch from one chapter to another
  useEffect(() => {
    if (!refDisplay.current) return;

    refDisplay.current.scrollTop = 0;
  }, [currentChapter]);

  return (
    <Box
      padding={"0.5rem"}
      smDown={{ padding: "0.2rem" }}
      flex={1}
      overflowY={"scroll"}
      minH={"100%"}
      ref={refDisplay}
    >
      <Flex
        bgColor={"brand.contrast"}
        minH={"100%"}
        border={"1px solid"}
        borderColor={"border.emphasized"}
        color={"inherit"}
        borderRadius={"l3"}
        flexDirection={"column"}
      >
        <ListTitle />
        <ListVerses currentChapter={currentChapter} />
      </Flex>
    </Box>
  );
};

export default Display;
