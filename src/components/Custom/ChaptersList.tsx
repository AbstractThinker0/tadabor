import { useEffect, useMemo, useRef, useState } from "react";

import useQuran from "@/context/useQuran";
import { Box } from "@chakra-ui/react";
import { InputString } from "@/components/Generic/Input";

interface ChaptersListProps {
  handleChapterChange: (chapter: string) => void;
  selectChapter: string;
}

const ChaptersList = ({
  handleChapterChange,
  selectChapter,
}: ChaptersListProps) => {
  const quranService = useQuran();

  const refChapter = useRef<HTMLDivElement | null>(null);

  const [chapterSearch, setChapterSearch] = useState("");

  const filteredChapters = useMemo(() => {
    return quranService.chapterNames.filter((chapter) =>
      chapter.name.includes(chapterSearch)
    );
  }, [quranService.chapterNames, chapterSearch]);

  useEffect(() => {
    if (!refChapter.current) return;

    refChapter.current.scrollIntoView({
      block: "center",
    });
  }, [selectChapter, filteredChapters]);

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChapterSearch(event.target.value);
  };

  const onClickChapter = (chapterID: number) => {
    handleChapterChange(String(chapterID));
  };

  const onClearInput = () => {
    setChapterSearch("");
  };

  return (
    <Box
      height={"80vh"}
      border="1px solid"
      borderColor={"border.emphasized"}
      borderRadius="md"
      overflow="hidden"
      bgColor={"brand.bg"}
      boxShadow="sm"
    >
      <InputString
        inputElementProps={{
          placeholder: quranService.getChapterName(selectChapter),
          border: "none",
          borderRadius: "0",
        }}
        value={chapterSearch}
        onChange={onChangeInput}
        onClear={onClearInput}
        dir="rtl"
      />
      <Box
        maxH="calc(100% - 40px)"
        aria-label="Chapters select"
        borderTop="1px solid"
        borderColor={"border.emphasized"}
        overflowY="scroll"
        fontSize={"sm"}
      >
        {filteredChapters.map((chapter) => (
          <Box
            key={chapter.id}
            ref={Number(selectChapter) === chapter.id ? refChapter : null}
            px="12px"
            py={"8px"}
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bgColor: "bg.muted" }}
            aria-selected={Number(selectChapter) === chapter.id}
            _selected={{
              color: "blue.fg",
              bgColor: "blue.subtle",
            }}
            onClick={() => onClickChapter(chapter.id)}
          >
            {chapter.id}. {chapter.name}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChaptersList;
