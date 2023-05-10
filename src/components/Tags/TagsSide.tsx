import { Dispatch, useEffect, useRef } from "react";
import { selectedChaptersType } from "../../types";
import AddTagModal from "./AddTagModal";
import DeleteTagModal from "./DeleteTagModal";
import {
  tagProps,
  tagsActions,
  tagsActionsProps,
  tagsProps,
  versesTagsProps,
} from "./consts";
import useQuran from "../../context/QuranContext";
import { dbFuncs } from "../../util/db";

interface TagsSideProps {
  currentChapter: number;
  selectedChapters: selectedChaptersType;
  tags: tagsProps;
  currentTag: tagProps | null;
  versesTags: versesTagsProps;
  dispatchTagsAction: Dispatch<tagsActionsProps>;
}

function TagsSide({
  currentChapter,
  selectedChapters,
  tags,
  currentTag,
  versesTags,
  dispatchTagsAction,
}: TagsSideProps) {
  const { chapterNames } = useQuran();
  const refChapter = useRef<HTMLDivElement | null>(null);

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

    refChapter.current = event.currentTarget;
  }

  function onChangeSelectChapter(chapterID: number) {
    dispatchTagsAction(tagsActions.toggleSelectChapter(chapterID));
  }

  function getSelectedCount() {
    return Object.keys(selectedChapters).filter(
      (chapterID) => selectedChapters[chapterID] === true
    ).length;
  }

  function onClickSelectAll() {
    const selectedChapters: selectedChaptersType = {};

    chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = true;
    });

    dispatchTagsAction(tagsActions.setSelectedChapters(selectedChapters));
  }

  function onClickDeselectAll() {
    const selectedChapters: selectedChaptersType = {};

    chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = false;
    });

    dispatchTagsAction(tagsActions.setSelectedChapters(selectedChapters));
  }

  function onClickSelectTag(tag: tagProps) {
    dispatchTagsAction(tagsActions.selectTag(tag));
  }

  function onClickDeleteTag(tag: tagProps) {
    dispatchTagsAction(tagsActions.setCurrentTag(tag));
  }

  function addTag(tag: tagProps) {
    dispatchTagsAction(tagsActions.addTag(tag));
  }

  function deleteTag(tagID: string) {
    dispatchTagsAction(tagsActions.deleteTag(tagID));

    dbFuncs.deleteTag(tagID);
  }

  const getTaggedVerses = (tagID: string) => {
    let countTags = 0;
    Object.keys(versesTags).forEach((verseKey: string) => {
      versesTags[verseKey].forEach((verseTagID) => {
        if (verseTagID === tagID) {
          countTags++;
        }
      });
    });
    return countTags;
  };

  return (
    <div className="tags-side">
      <div className="tags-side-chapters">
        {chapterNames.map((chapter) => (
          <div
            key={chapter.id}
            className={`tags-side-chapters-item ${
              currentChapter === chapter.id
                ? "tags-side-chapters-item-selected"
                : ""
            }`}
          >
            <div
              className={"tags-side-chapters-item-name"}
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
      <div className="tags-side-chapters-buttons" dir="ltr">
        <button
          disabled={getSelectedCount() === 114}
          onClick={onClickSelectAll}
          className="btn btn-dark btn-sm"
        >
          Select all
        </button>
        <button
          disabled={getSelectedCount() === 0}
          onClick={onClickDeselectAll}
          className="btn btn-dark btn-sm"
        >
          Deselect all
        </button>
      </div>
      <div className="tags-side-list" dir="ltr">
        <div className="fw-bold pb-1">Tags list:</div>
        {Object.keys(tags).length > 0 && (
          <div className="tags-side-list-items">
            {Object.keys(tags).map((tagID) => (
              <div className="tags-side-list-items-item" key={tagID}>
                <div
                  className="tags-side-list-items-item-text"
                  onClick={() => onClickSelectTag(tags[tagID])}
                >
                  {tags[tagID].tagDisplay}
                </div>
                <div
                  data-bs-toggle="modal"
                  data-bs-target="#deleteTagModal"
                  onClick={() => onClickDeleteTag(tags[tagID])}
                >
                  🗑️
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          data-bs-toggle="modal"
          data-bs-target="#addTagModal"
          className="btn btn-dark tags-side-list-btn"
        >
          Add tag
        </button>
      </div>
      <AddTagModal addTag={addTag} />
      <DeleteTagModal
        deleteTag={deleteTag}
        currentTag={currentTag}
        versesCount={currentTag ? getTaggedVerses(currentTag.tagID) : 0}
      />
    </div>
  );
}

export default TagsSide;
