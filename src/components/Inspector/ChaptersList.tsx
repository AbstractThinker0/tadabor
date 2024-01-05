import { useState } from "react";
import useQuran from "@/context/useQuran";

interface ChaptersListProps {
  selectedChapter: number;
  handleSelectChapter: (chapterID: string) => void;
}

const ChaptersList = ({
  selectedChapter,
  handleSelectChapter,
}: ChaptersListProps) => {
  const quranService = useQuran();
  const [chapterSearch, setChapterSearch] = useState("");

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChapterSearch(event.target.value);
  };

  function onChangeSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    handleSelectChapter(event.target.value);
  }

  return (
    <div className="side">
      <div className="side-chapters">
        <input
          className="form-control side-chapters-input"
          type="search"
          value={chapterSearch}
          onChange={onChangeInput}
          placeholder=""
          aria-label="Search"
          dir="rtl"
        />
        <select
          className="form-select side-chapters-list"
          size={7}
          onChange={onChangeSelect}
          aria-label="size 7 select example"
          value={selectedChapter}
        >
          {quranService.chapterNames
            .filter((chapter) => chapter.name.includes(chapterSearch))
            .map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.id}. {chapter.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default ChaptersList;
