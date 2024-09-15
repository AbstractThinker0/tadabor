import useQuran from "@/context/useQuran";
import { useAppSelector } from "@/store";
import { verseProps } from "@/types";
import { Box, Flex, Select } from "@chakra-ui/react";

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
      bgColor={"rgb(187, 186, 186)"}
      position={"sticky"}
      top={"0"}
      zIndex={"1020"}
    >
      <Box w={"15vw"}>
        <Select
          onChange={onChangeChapter}
          value={currentChapter}
          dir="ltr"
          bgColor={"white"}
        >
          {quranService.chapterNames.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.id}. {chapter.name}
            </option>
          ))}
        </Select>
      </Box>
      <div>
        <Select
          onClick={onClickSelectVerse}
          defaultValue={currentVerse}
          dir="ltr"
          bgColor={"white"}
        >
          {chapterVerses.map((verse) => (
            <option key={verse.key} value={verse.key}>
              {verse.verseid}
            </option>
          ))}
        </Select>
      </div>
    </Flex>
  );
};

export default Menu;
