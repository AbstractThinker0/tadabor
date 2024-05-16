import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store";

import { tagsPageActions } from "@/store/slices/pages/tags";

import { dbFuncs } from "@/util/db";

import { tagProps, tagsProps } from "./consts";
import AddTagModal from "./AddTagModal";
import DeleteTagModal from "./DeleteTagModal";
import ChaptersList from "./ChaptersList";

function TagsSide() {
  const dispatch = useAppDispatch();
  const {
    currentChapter,
    selectedChapters,
    tags,
    selectedTags,
    currentTag,
    versesTags,
  } = useAppSelector((state) => state.tagsPage);

  function onClickSelectTag(tag: tagProps) {
    dispatch(tagsPageActions.selectTag(tag));
  }

  function onClickDeleteTag(tag: tagProps) {
    dispatch(tagsPageActions.setCurrentTag(tag));
  }

  function addTag(tag: tagProps) {
    dispatch(tagsPageActions.addTag(tag));
  }

  function deleteTag(tagID: string) {
    dispatch(tagsPageActions.deleteTag(tagID));

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

  const isTagSelected = (tagID: string) => (selectedTags[tagID] ? true : false);

  return (
    <div className="tags-side">
      <ChaptersList
        currentChapter={currentChapter}
        selectedChapters={selectedChapters}
      />
      <SideList
        tags={tags}
        isTagSelected={isTagSelected}
        onClickSelectTag={onClickSelectTag}
        onClickDeleteTag={onClickDeleteTag}
        getTaggedVerses={getTaggedVerses}
      />
      <VersesCount />
      <AddTagModal addTag={addTag} />
      <DeleteTagModal
        deleteTag={deleteTag}
        currentTag={currentTag}
        versesCount={currentTag ? getTaggedVerses(currentTag.tagID) : 0}
      />
    </div>
  );
}

interface SideListProps {
  tags: tagsProps;
  isTagSelected: (tagID: string) => boolean;
  onClickSelectTag(tag: tagProps): void;
  onClickDeleteTag(tag: tagProps): void;
  getTaggedVerses: (tagID: string) => number;
}

const SideList = ({
  tags,
  isTagSelected,
  onClickSelectTag,
  onClickDeleteTag,
  getTaggedVerses,
}: SideListProps) => {
  return (
    <div className="tags-side-list" dir="ltr">
      <div className="fw-bold pb-1">Tags list:</div>
      {Object.keys(tags).length > 0 && (
        <div className="tags-side-list-items">
          {Object.keys(tags).map((tagID) => (
            <div
              className={`tags-side-list-items-item ${
                isTagSelected(tagID) ? "tags-side-list-items-item-selected" : ""
              }`}
              key={tagID}
            >
              <div
                className="tags-side-list-items-item-text"
                onClick={() => onClickSelectTag(tags[tagID])}
              >
                {tags[tagID].tagDisplay} ({getTaggedVerses(tagID)})
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
  );
};

const VersesCount = () => {
  const { t } = useTranslation();
  const tagsState = useAppSelector((state) => state.tagsPage);

  const getSelectedVerses = () => {
    const asArray = Object.entries(tagsState.versesTags);

    const filtered = asArray.filter(([key, tags]) => {
      const info = key.split("-");
      return (
        tagsState.selectedChapters[info[0]] === true &&
        tags.some((tagID) =>
          Object.keys(tagsState.selectedTags).includes(tagID)
        )
      );
    });

    return filtered.length;
  };

  const selectedCount = getSelectedVerses();

  if (!Object.keys(tagsState.selectedTags).length) return <></>;

  return (
    <>
      <div className="fw-bold text-success">
        {`${t("search_count")} ${selectedCount}`}
      </div>
    </>
  );
};

export default TagsSide;
