import useQuran from "@/context/useQuran";
import { useAppSelector } from "@/store";
import { RankedVerseProps } from "@/types";

interface MenuProps {
  chapterVerses: RankedVerseProps[];
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
    <div className="menu sticky-top">
      <div className="menu-chapters">
        <select
          className="form-select"
          onChange={onChangeChapter}
          value={currentChapter}
        >
          {quranService.chapterNames.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.id}. {chapter.name}
            </option>
          ))}
        </select>
      </div>
      <div className="menu-verses">
        <select
          className="form-select"
          onClick={onClickSelectVerse}
          defaultValue={currentVerse}
        >
          {chapterVerses.map((verse) => (
            <option key={verse.key} value={verse.key}>
              {verse.verseid}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Menu;
