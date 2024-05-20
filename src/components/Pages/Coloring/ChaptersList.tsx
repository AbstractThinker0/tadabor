import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { selectedChaptersType } from "@/types";

const ChaptersList = () => {
  const coloringState = useAppSelector((state) => state.coloringPage);
  const dispatch = useAppDispatch();
  const [chapterToken, setChapterToken] = useState("");
  const quranService = useQuran();
  const { t } = useTranslation();
  const refChapter = useRef<HTMLDivElement | null>(null);

  function onChangeChapterToken(event: React.ChangeEvent<HTMLInputElement>) {
    setChapterToken(event.target.value);
  }

  function onClickChapter(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chapterID: number
  ) {
    dispatch(coloringPageActions.setChapter(chapterID));
    setChapterToken("");

    document.documentElement.scrollTop = 0;

    refChapter.current = event.currentTarget;
  }

  useEffect(() => {
    const child = refChapter.current;
    const parent = refChapter.current?.parentElement?.parentElement;

    if (!child || !parent) return;

    const parentOffsetTop = parent.offsetTop;

    if (
      parent.scrollTop + parentOffsetTop <
        child.offsetTop - parent.clientHeight + child.clientHeight * 2.5 ||
      parent.scrollTop + parentOffsetTop >
        child.offsetTop - child.clientHeight * 2.5
    ) {
      parent.scrollTop =
        child.offsetTop - parentOffsetTop - parent.clientHeight / 2;
    }
  }, [coloringState.currentChapter]);

  function onChangeSelectChapter(chapterID: number) {
    dispatch(coloringPageActions.toggleSelectChapter(chapterID));
  }

  function onClickSelectAll() {
    const selectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = true;
    });

    dispatch(coloringPageActions.setSelectedChapters(selectedChapters));
  }

  function onClickDeselectAll() {
    const selectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = false;
    });

    selectedChapters[coloringState.currentChapter] = true;

    dispatch(coloringPageActions.setSelectedChapters(selectedChapters));
  }

  const currentSelectedChapters = Object.keys(
    coloringState.selectedChapters
  ).filter((chapterID) => coloringState.selectedChapters[chapterID] === true);

  const getSelectedCount = currentSelectedChapters.length;

  const onlyCurrentSelected =
    getSelectedCount === 1 &&
    Number(currentSelectedChapters[0]) === coloringState.currentChapter;

  return (
    <div className="side-chapters">
      <input
        className="side-chapters-search"
        type="text"
        placeholder={quranService.getChapterName(coloringState.currentChapter)}
        value={chapterToken}
        onChange={onChangeChapterToken}
      />
      <div className="side-chapters-list">
        {quranService.chapterNames
          .filter((chapter) => chapter.name.includes(chapterToken))
          .map((chapter) => (
            <div
              key={chapter.id}
              className={`side-chapters-list-item ${
                coloringState.currentChapter === chapter.id
                  ? "side-chapters-list-item-selected"
                  : ""
              }`}
            >
              <div
                className="side-chapters-list-item-name"
                onClick={(event) => onClickChapter(event, chapter.id)}
              >
                {chapter.name}
              </div>

              <input
                type="checkbox"
                checked={
                  coloringState.selectedChapters[chapter.id] !== undefined
                    ? coloringState.selectedChapters[chapter.id]
                    : true
                }
                onChange={() => onChangeSelectChapter(chapter.id)}
              />
            </div>
          ))}
      </div>
      <div className="side-chapters-buttons" dir="ltr">
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
  );
};

export default ChaptersList;
