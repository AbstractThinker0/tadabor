import { Dispatch } from "react";

import { selectedChaptersType } from "@/types";
import { dbFuncs } from "@/util/db";

import {
  tagProps,
  tagsActions,
  tagsActionsProps,
  tagsProps,
  versesTagsProps,
} from "./consts";
import AddTagModal from "./AddTagModal";
import DeleteTagModal from "./DeleteTagModal";
import ChaptersList from "./ChaptersList";

interface TagsSideProps {
  currentChapter: number;
  selectedChapters: selectedChaptersType;
  tags: tagsProps;
  selectedTags: tagsProps;
  currentTag: tagProps | null;
  versesTags: versesTagsProps;
  dispatchTagsAction: Dispatch<tagsActionsProps>;
}

function TagsSide({
  currentChapter,
  selectedChapters,
  tags,
  selectedTags,
  currentTag,
  versesTags,
  dispatchTagsAction,
}: TagsSideProps) {
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

  const isTagSelected = (tagID: string) => (selectedTags[tagID] ? true : false);

  return (
    <div className="tags-side">
      <ChaptersList
        currentChapter={currentChapter}
        selectedChapters={selectedChapters}
        dispatchTagsAction={dispatchTagsAction}
      />
      <SideList
        tags={tags}
        isTagSelected={isTagSelected}
        onClickSelectTag={onClickSelectTag}
        onClickDeleteTag={onClickDeleteTag}
      />
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
}

const SideList = ({
  tags,
  isTagSelected,
  onClickSelectTag,
  onClickDeleteTag,
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
  );
};

export default TagsSide;
