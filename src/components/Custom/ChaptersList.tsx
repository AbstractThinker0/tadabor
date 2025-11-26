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
  }, [chapterSearch]);

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
    <Box height={"80vh"}>
      <InputString
        inputElementProps={{
          placeholder: quranService.getChapterName(selectChapter),
          borderBottom: "none",
          borderBottomRadius: "0",
        }}
        value={chapterSearch}
        onChange={onChangeInput}
        onClear={onClearInput}
        dir="rtl"
      />
      <Box
        maxH="60%"
        height={"60%"}
        aria-label="Chapters select"
        bgColor={"brand.bg"}
        border="1px solid"
        borderColor={"border.emphasized"}
        overflowY="scroll"
        padding="2px"
      >
        {filteredChapters.map((chapter) => (
          <Box
            key={chapter.id}
            ref={Number(selectChapter) === chapter.id ? refChapter : null}
            px="14px"
            py={"2px"}
            mdDown={{ py: "8px" }}
            cursor="pointer"
            data-id={chapter.id}
            aria-selected={Number(selectChapter) === chapter.id}
            _selected={{
              color: "white",
              bgColor: "fg.muted",
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
