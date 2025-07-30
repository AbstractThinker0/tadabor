import useQuran from "@/context/useQuran";
import { useAppSelector } from "@/store";
import type { verseProps } from "quran-tools";
import { Box, Flex, NativeSelect } from "@chakra-ui/react";

interface MenuProps {
  chapterVerses: verseProps[];
  handleSetChapter: (chapterID: string) => void;
  handleSelectVerse: (verseKey: string) => void;
}

const Menu = ({
  chapterVerses,
  handleSetChapter,
  handleSelectVerse,
}: MenuProps) => {
  const quranService = useQuran();

  const currentChapter = useAppSelector(
    (state) => state.comparatorPage.currentChapter
  );
  const currentVerse = useAppSelector(
    (state) => state.comparatorPage.currentVerse
  );

  const onChangeChapter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleSetChapter(event.target.value);
    document.documentElement.scrollTop = 0;
  };

  const onChangeVerse = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const verseKey = event.target.value;

    if (!verseKey) return;

    handleSelectVerse(verseKey);
  };

  return (
    <Flex
      gap={"10px"}
      py={"0.5rem"}
      px={"1rem"}
      bgColor={"gray.emphasized"}
      position={"sticky"}
      top={"0"}
      zIndex={"dropdown"}
    >
      <Box maxW={"30vw"}>
        <NativeSelect.Root>
          <NativeSelect.Field
            onChange={onChangeChapter}
            value={currentChapter}
            bgColor={"bg"}
          >
            {quranService.chapterNames.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.id}. {chapter.name}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Box>
      <div>
        <NativeSelect.Root>
          <NativeSelect.Field
            onChange={onChangeVerse}
            value={currentVerse}
            bgColor={"bg"}
          >
            {chapterVerses.map((verse) => (
              <option key={verse.key} value={verse.key}>
                {verse.verseid}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </div>
    </Flex>
  );
};

export default Menu;
