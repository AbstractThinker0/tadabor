import { useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

interface SelectionListChaptersProps {
  handleChapterChange: (chapter: number) => void;
  selectChapter: number;
}

const SelectionListChapters = ({
  handleChapterChange,
  selectChapter,
}: SelectionListChaptersProps) => {
  const { t } = useTranslation();
  const quranService = useQuran();
  const [chapterSearch, setChapterSearch] = useState("");

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChapterSearch(event.target.value);
  };

  function onFocusSelect(event: React.FocusEvent<HTMLSelectElement, Element>) {
    handleChapterChange(Number(event.target.value));
  }

  function onChangeSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    handleChapterChange(Number(event.target.value));
  }

  return (
    <div className="side border-start justify-content-center">
      <div className="side-chapters container mt-2">
        <h4 className="side-chapters-title">{t("roots_list")}</h4>
        <input
          className="side-chapters-input form-control"
          type="search"
          value={chapterSearch}
          onChange={onChangeInput}
          placeholder={quranService.getChapterName(selectChapter)}
          aria-label="Search"
          dir="rtl"
        />
        <select
          className="form-select"
          size={7}
          aria-label="size 7 select"
          onChange={onChangeSelect}
          onFocus={onFocusSelect}
          value={selectChapter}
        >
          {quranService.chapterNames
            .filter((chapter) => chapter.name.startsWith(chapterSearch))
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

export default SelectionListChapters;
