import { useEffect, useRef } from "react";

import useQuran from "@/context/useQuran";

import { useAppSelector } from "@/store";

import ListVerses from "@/components/Pages/Letters/ListVerses";
import { Box } from "@chakra-ui/react";

const Display = () => {
  const quranService = useQuran();
  const refDisplay = useRef<HTMLDivElement>(null);

  const currentChapter = useAppSelector(
    (state) => state.lettersPage.currentChapter
  );

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
      <Box
        bgColor={"brand.panel"}
        color={"inherit"}
        minH={"100%"}
        borderRadius={"l3"}
        border={"1px solid"}
        borderColor={"border"}
      >
        <Box
          textAlign={"center"}
          color={"blue.fg"}
          fontSize={"xx-large"}
          py={1}
        >
          سورة {quranService.getChapterName(currentChapter)}
        </Box>
        <ListVerses />
      </Box>
    </Box>
  );
};

export default Display;
