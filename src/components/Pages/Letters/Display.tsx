import { useEffect, useRef } from "react";

import useQuran from "@/context/useQuran";

import { useAppSelector } from "@/store";

import ListVerses from "@/components/Pages/Letters/ListVerses";
import { Box, Card, CardHeader } from "@chakra-ui/react";

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
      <Card bgColor={"#f7fafc"} minH={"100%"}>
        <CardHeader
          textAlign={"center"}
          color={"blue.600"}
          fontSize={"xx-large"}
          py={1}
        >
          سورة {quranService.getChapterName(currentChapter)}
        </CardHeader>
        <ListVerses />
      </Card>
    </Box>
  );
};

export default Display;
