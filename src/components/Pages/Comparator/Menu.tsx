import useQuran from "@/context/useQuran";
import { useAppSelector } from "@/store";
import { verseProps } from "@/types";
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

  const onClickSelectVerse = (
    e: React.MouseEvent<HTMLSelectElement, MouseEvent>
  ) => {
    // Only be concerned about an option click
    if (e.detail !== 0) return;

    const verseKey = e.currentTarget.value;

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
      zIndex={"1020"}
    >
      <Box w={"15vw"}>
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
            onClick={onClickSelectVerse}
            defaultValue={currentVerse}
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
