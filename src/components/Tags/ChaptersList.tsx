import { Dispatch, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { selectedChaptersType } from "@/types";
import useQuran from "@/context/useQuran";

import { tagsActions, tagsActionsProps } from "./consts";

interface ChaptersListProps {
  currentChapter: number;
  selectedChapters: selectedChaptersType;
  dispatchTagsAction: Dispatch<tagsActionsProps>;
}

const ChaptersList = ({
  currentChapter,
  selectedChapters,
  dispatchTagsAction,
}: ChaptersListProps) => {
  const quranService = useQuran();
  const { t } = useTranslation();
  const refChapter = useRef<HTMLDivElement | null>(null);
  const [chapterToken, setChapterToken] = useState("");

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
  }, [currentChapter]);

  function onClickChapter(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chapterID: number
  ) {
    document.documentElement.scrollTop = 0;

    dispatchTagsAction(tagsActions.setChapter(chapterID));
    setChapterToken("");

    refChapter.current = event.currentTarget;
  }

  function onChangeSelectChapter(chapterID: number) {
    dispatchTagsAction(tagsActions.toggleSelectChapter(chapterID));
  }

  const currentSelectedChapters = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedCount = currentSelectedChapters.length;

  const onlyCurrentSelected =
    getSelectedCount === 1 &&
    Number(currentSelectedChapters[0]) === currentChapter;

  function onClickSelectAll() {
    const selectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = true;
    });

    dispatchTagsAction(tagsActions.setSelectedChapters(selectedChapters));
  }

  function onClickDeselectAll() {
    const selectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = false;
    });

    selectedChapters[currentChapter] = true;

    dispatchTagsAction(tagsActions.setSelectedChapters(selectedChapters));
  }

  const onChangeChapterToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChapterToken(e.target.value);
  };

  return (
    <>
      <div className="tags-side-chapters">
        <input
          className="tags-side-chapters-search"
          type="text"
          placeholder={quranService.getChapterName(currentChapter)}
          value={chapterToken}
          onChange={onChangeChapterToken}
        />
        <div className="tags-side-chapters-list">
          {quranService.chapterNames
            .filter((chapter) => chapter.name.includes(chapterToken))
            .map((chapter) => (
              <div
                key={chapter.id}
                className={`tags-side-chapters-list-item ${
                  currentChapter === chapter.id
                    ? "tags-side-chapters-list-item-selected"
                    : ""
                }`}
              >
                <div
                  className={"tags-side-chapters-list-item-name"}
                  onClick={(event) => onClickChapter(event, chapter.id)}
                >
                  {chapter.id}. {chapter.name}
                </div>
                <input
                  type="checkbox"
                  checked={
                    selectedChapters[chapter.id] !== undefined
                      ? selectedChapters[chapter.id]
                      : true
                  }
                  onChange={() => onChangeSelectChapter(chapter.id)}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="tags-side-chapters-buttons" dir="ltr">
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
    </>
  );
};

export default ChaptersList;
