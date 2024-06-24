import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store";

import { tagsPageActions } from "@/store/slices/pages/tags";

import { dbFuncs } from "@/util/db";

import { tagProps } from "@/components/Pages/Tags/consts";
import AddTagModal from "@/components/Pages/Tags/AddTagModal";
import DeleteTagModal from "@/components/Pages/Tags/DeleteTagModal";
import ChaptersList from "@/components/Pages/Tags/ChaptersList";

function TagsSide() {
  const dispatch = useAppDispatch();

  const currentTag = useAppSelector((state) => state.tagsPage.currentTag);

  const versesTags = useAppSelector((state) => state.tagsPage.versesTags);

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

  return (
    <div className="tags-side">
      <ChaptersList />
      <SideList
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
  onClickSelectTag(tag: tagProps): void;
  onClickDeleteTag(tag: tagProps): void;
  getTaggedVerses: (tagID: string) => number;
}

const SideList = ({
  onClickSelectTag,
  onClickDeleteTag,
  getTaggedVerses,
}: SideListProps) => {
  const tags = useAppSelector((state) => state.tagsPage.tags);

  const selectedTags = useAppSelector((state) => state.tagsPage.selectedTags);

  const isTagSelected = (tagID: string) => (selectedTags[tagID] ? true : false);

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

  const versesTags = useAppSelector((state) => state.tagsPage.versesTags);
  const selectedChapters = useAppSelector(
    (state) => state.tagsPage.selectedChapters
  );
  const selectedTags = useAppSelector((state) => state.tagsPage.selectedTags);

  const getSelectedVerses = () => {
    const asArray = Object.entries(versesTags);

    const filtered = asArray.filter(([key, tags]) => {
      const info = key.split("-");
      return (
        selectedChapters[info[0]] === true &&
        tags.some((tagID) => Object.keys(selectedTags).includes(tagID))
      );
    });

    return filtered.length;
  };

  const selectedCount = getSelectedVerses();

  if (!Object.keys(selectedTags).length) return <></>;

  return (
    <>
      <div className="fw-bold text-success">
        {`${t("search_count")} ${selectedCount}`}
      </div>
    </>
  );
};

export default TagsSide;
