import { useEffect, useRef } from "react";

import useQuran from "@/context/useQuran";

import ListVerses from "@/components/Pages/Inspector/ListVerses";
import { Box, Card, CardHeader } from "@chakra-ui/react";

interface DisplayProps {
  currentChapter: string;
}

const Display = ({ currentChapter }: DisplayProps) => {
  const quranService = useQuran();
  const refDisplay = useRef<HTMLDivElement>(null);

  // Reset scroll whenever we switch from one chapter to another
  useEffect(() => {
    if (!refDisplay.current) return;

    refDisplay.current.scrollTop = 0;
  }, [currentChapter]);

  return (
    <Box p={2} flex={1} overflowY={"scroll"} minH={"100%"} ref={refDisplay}>
      <Card
        bgColor={"#f7fafc"}
        minH={"100%"}
        border={"1px solid rgba(0, 0, 0, .175)"}
      >
        <CardHeader
          py={0}
          textAlign={"center"}
          fontSize={"x-large  "}
          color={"blue.500"}
          bgColor={"rgba(33, 37, 41, .03)"}
          borderBottom={"1px solid rgba(0, 0, 0, .175)"}
        >
          سورة {quranService.getChapterName(currentChapter)}
        </CardHeader>
        <ListVerses currentChapter={currentChapter} />
      </Card>
    </Box>
  );
};

export default Display;
