import { memo, useState } from "react";
import useQuran from "../../context/QuranContext";
import { selectedChaptersType } from "../../types";
import { useTranslation } from "react-i18next";

interface SelectionListChaptersProps {
  currentChapter: number;
  handleSelectedChapters: (selectedChapters: string[]) => void;
  handleCurrentChapter: (chapterID: number) => void;
}

const SelectionListChapters = memo(
  ({
    currentChapter,
    handleSelectedChapters,
    handleCurrentChapter,
  }: SelectionListChaptersProps) => {
    const { chapterNames } = useQuran();
    const { t } = useTranslation();

    const [chapterSearch, setChapterSearch] = useState("");

    const [selectionChapters, setSelectionChapters] = useState(() => {
      const initialSelectionChapters: selectedChaptersType = {};

      chapterNames.forEach((chapter) => {
        initialSelectionChapters[chapter.id] = true;
      });

      return initialSelectionChapters;
    });

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChapterSearch(event.target.value);
    };

    const onClickChapter = (chapterID: number) => {
      handleCurrentChapter(chapterID);
    };

    const onClickSelectAll = () => {
      const newSelectionChapters: selectedChaptersType = {};

      chapterNames.forEach((chapter) => {
        newSelectionChapters[chapter.id] = true;
      });

      setSelectionChapters(newSelectionChapters);

      handleSelectedChapters(
        Array.from(chapterNames, (chapter) => chapter.id.toString())
      );
    };

    const onClickDeselectAll = () => {
      const newSelectionChapters: selectedChaptersType = {};

      chapterNames.forEach((chapter) => {
        newSelectionChapters[chapter.id] = false;
      });

      newSelectionChapters[currentChapter] = true;

      setSelectionChapters(newSelectionChapters);

      handleSelectedChapters([currentChapter.toString()]);
    };

    const onChangeSelectChapter = (chapterID: number) => {
      const newSelectionChapters: selectedChaptersType = {
        ...selectionChapters,
        [chapterID]: !selectionChapters[chapterID],
      };

      setSelectionChapters(newSelectionChapters);

      handleSelectedChapters(
        Object.keys(newSelectionChapters).filter(
          (chapter) => newSelectionChapters[chapter] === true
        )
      );
    };

    const selectedChapters = Object.keys(selectionChapters).filter(
      (chapterID) => selectionChapters[chapterID] === true
    );

    const getSelectedCount = selectedChapters.length;

    const onlyCurrentSelected =
      getSelectedCount === 1 && Number(selectedChapters[0]) === currentChapter;

    return (
      <div className="container mb-2 p-0 browser-search-chapter">
        <input
          className="form-control browser-search-chapter-input"
          type="search"
          value={chapterSearch}
          onChange={onChangeInput}
          placeholder={chapterNames[currentChapter - 1].name}
          aria-label="Search"
          dir="rtl"
        />
        <div className="browser-search-chapter-list">
          {chapterNames
            .filter((chapter) => chapter.name.includes(chapterSearch))
            .map((chapter) => (
              <div
                key={chapter.id}
                className={`browser-search-chapter-list-item ${
                  currentChapter === chapter.id
                    ? "browser-search-chapter-list-item-selected"
                    : ""
                }`}
              >
                <div
                  className={"browser-search-chapter-list-item-name"}
                  onClick={() => onClickChapter(chapter.id)}
                >
                  {chapter.id}. {chapter.name}
                </div>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectionChapters[chapter.id]}
                  onChange={() => onChangeSelectChapter(chapter.id)}
                />
              </div>
            ))}
        </div>
        <div className="browser-search-chapter-footer">
          <div className="text-center fw-bold">{t("search_scope")}:</div>
          <div className="browser-search-chapter-footer-buttons">
            <button
              disabled={getSelectedCount === 114}
              onClick={onClickSelectAll}
              className="btn btn-dark btn-sm"
            >
              {t("all_chapters")}
            </button>
            <button
              disabled={onlyCurrentSelected}
              onClick={onClickDeselectAll}
              className="btn btn-dark btn-sm"
            >
              {t("current_chapter")}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SelectionListChapters.displayName = "SelectionListChapters";

export default SelectionListChapters;
