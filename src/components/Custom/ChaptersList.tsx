import { useCallback, useMemo, useState } from "react";

import useQuran from "@/context/useQuran";
import { Box, Input } from "@chakra-ui/react";

interface ChaptersListProps {
  handleChapterChange: (chapter: string) => void;
  selectChapter: string;
}

const ChaptersList = ({
  handleChapterChange,
  selectChapter,
}: ChaptersListProps) => {
  const quranService = useQuran();
  const [chapterSearch, setChapterSearch] = useState("");

  const filteredChapters = useMemo(() => {
    return quranService.chapterNames.filter((chapter) =>
      chapter.name.includes(chapterSearch)
    );
  }, [chapterSearch]);

  // Callback ref to handle the scroll behavior when the selected chapter changes
  const handleChapterListRef = useCallback(
    (parent: HTMLDivElement | null) => {
      if (!parent) return;

      const selectedChapter = parent.querySelector<HTMLDivElement>(
        `[data-id="${selectChapter}"]`
      );

      if (!selectedChapter) return;

      const isOutOfView =
        parent.scrollTop + parent.offsetTop <
          selectedChapter.offsetTop -
            parent.clientHeight +
            selectedChapter.clientHeight * 1.7 ||
        parent.scrollTop + parent.offsetTop >
          selectedChapter.offsetTop - selectedChapter.clientHeight * 1.1;

      if (isOutOfView) {
        parent.scrollTop =
          selectedChapter.offsetTop -
          parent.offsetTop -
          parent.clientHeight / 2;
      }
    },
    [selectChapter, filteredChapters]
  );

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChapterSearch(event.target.value);
  };

  const onClickChapter = (chapterID: number) => {
    handleChapterChange(String(chapterID));
  };

  return (
    <Box maxH="100%">
      <Input
        type="search"
        value={chapterSearch}
        onChange={onChangeInput}
        placeholder={quranService.getChapterName(selectChapter)}
        aria-label="Search"
        dir="rtl"
        borderBottom="none"
        borderBottomRadius="0"
        backgroundColor={"white"}
      />
      <Box
        maxH="60%"
        height={"60%"}
        aria-label="Chapters select"
        bgColor="var(--color-primary)"
        border="1px solid gainsboro"
        overflowY="scroll"
        padding="2px"
        ref={handleChapterListRef}
      >
        {filteredChapters.map((chapter) => (
          <Box
            key={chapter.id}
            px="14px"
            cursor="pointer"
            data-id={chapter.id}
            aria-selected={Number(selectChapter) === chapter.id}
            _selected={{
              color: "white",
              bgColor: "#767676",
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
