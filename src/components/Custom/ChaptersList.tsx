import { useState } from "react";

import useQuran from "@/context/useQuran";

interface ChaptersListProps {
  handleChapterChange: (chapter: string) => void;
  selectChapter: string;
  mainClass?: string;
  inputClass?: string;
  selectClass?: string;
}

const ChaptersList = ({
  handleChapterChange,
  selectChapter,
  mainClass = "",
  inputClass = "",
  selectClass = "",
}: ChaptersListProps) => {
  const quranService = useQuran();
  const [chapterSearch, setChapterSearch] = useState("");

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChapterSearch(event.target.value);
  };

  const onFocusSelect = (
    event: React.FocusEvent<HTMLSelectElement, Element>
  ) => {
    handleChapterChange(event.target.value);
  };

  const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleChapterChange(event.target.value);
  };

  return (
    <div className={mainClass}>
      <input
        className={inputClass.concat(" form-control")}
        type="search"
        value={chapterSearch}
        onChange={onChangeInput}
        placeholder={quranService.getChapterName(selectChapter)}
        aria-label="Search"
        dir="rtl"
      />
      <select
        className={selectClass.concat(" form-select")}
        size={7}
        aria-label="Chapters select"
        onChange={onChangeSelect}
        onFocus={onFocusSelect}
        value={selectChapter}
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
  );
};

export default ChaptersList;
