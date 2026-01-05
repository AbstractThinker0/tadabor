import { useEffect, useRef } from "react";

import { useLettersPageStore } from "@/store/zustand/lettersPage";

import { ListTitle } from "@/components/Pages/Letters/ListTitle";
import ListVerses from "@/components/Pages/Letters/ListVerses";
import { Box, Flex } from "@chakra-ui/react";

const Display = () => {
  const refDisplay = useRef<HTMLDivElement>(null);

  const currentChapter = useLettersPageStore((state) => state.currentChapter);

  // Reset scroll whenever we switch from one chapter to another
  useEffect(() => {
    if (!refDisplay.current) return;

    refDisplay.current.scrollTop = 0;
  }, [currentChapter]);

  return (
    <Box
      padding={2}
      flex={1}
      overflowY={"scroll"}
      minH={"100%"}
      ref={refDisplay}
    >
      <Flex
        bgColor={"brand.panel"}
        color={"inherit"}
        minH={"100%"}
        borderRadius={"l3"}
        border={"1px solid"}
        borderColor={"border"}
        flexDirection={"column"}
      >
        <ListTitle />
        <ListVerses />
      </Flex>
    </Box>
  );
};

export default Display;
