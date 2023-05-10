import { Dispatch, useEffect, useReducer, useRef, useState } from "react";
import useQuran from "../context/QuranContext";
import tagsReducer from "../reducers/tagsReducer";
import {
  tagProps,
  tagsActions,
  tagsActionsProps,
  tagsProps,
  tagsStateProps,
  versesTagsProps,
} from "../components/Tags/consts";
import { selectedChaptersType, verseProps } from "../types";

import { dbFuncs } from "../util/db";

import AddTagModal from "../components/Tags/AddTagModal";
import LoadingSpinner from "../components/LoadingSpinner";
import DeleteTagModal from "../components/Tags/DeleteTagModal";
import VerseTagsModal from "../components/Tags/VerseTagsModal";

function Tags() {
  const { chapterNames } = useQuran();

  const [loadingState, setLoadingState] = useState(true);

  const initialSelectedChapters: selectedChaptersType = {};

  chapterNames.forEach((chapter) => {
    initialSelectedChapters[chapter.id] = true;
  });

  const initialState: tagsStateProps = {
    currentChapter: 1,
    selectedChapters: initialSelectedChapters,
    tags: {},
    currentTag: null,
    versesTags: {},
    currentVerse: null,
    selectedTags: {},
  };

  const [state, dispatchTagsAction] = useReducer(tagsReducer, initialState);

  useEffect(() => {
    let clientLeft = false;

    async function fetchData() {
      const savedTags = await dbFuncs.loadTags();

      if (clientLeft) return;

      const initialTags: tagsProps = {};

      savedTags.forEach((tag) => {
        initialTags[tag.id] = { tagDisplay: tag.name, tagID: tag.id };
      });

      dispatchTagsAction(tagsActions.setTags(initialTags));

      const versesTags = await dbFuncs.loadVersesTags();

      if (clientLeft) return;

      const initialVersesTags: versesTagsProps = {};

      versesTags.forEach((verseTag) => {
        initialVersesTags[verseTag.verse_key] = verseTag.tags_ids;
      });

      dispatchTagsAction(tagsActions.setVersesTags(initialVersesTags));

      setLoadingState(false);
    }

    fetchData();

    return () => {
      clientLeft = true;
    };
  }, []);

  function addTag(tag: tagProps) {
    dispatchTagsAction(tagsActions.addTag(tag));
  }

  function deleteTag(tagID: string) {
    dispatchTagsAction(tagsActions.deleteTag(tagID));

    dbFuncs.deleteTag(tagID);
  }

  function setCurrentVerse(verse: verseProps | null) {
    dispatchTagsAction(tagsActions.setCurrentVerse(verse));
  }

  function setVerseTags(verseKey: string, tags: string[] | null) {
    if (tags === null) {
      dbFuncs.deleteVerseTags(verseKey);
    } else {
      dbFuncs.saveVerseTags({ verse_key: verseKey, tags_ids: tags });
    }

    dispatchTagsAction(tagsActions.setVerseTags({ verseKey, tags }));
  }

  const getTaggedVerses = (tagID: string) => {
    let countTags = 0;
    Object.keys(state.versesTags).forEach((verseKey: string) => {
      state.versesTags[verseKey].forEach((verseTagID) => {
        if (verseTagID === tagID) {
          countTags++;
        }
      });
    });
    return countTags;
  };

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="tags">
      <TagsSide
        currentChapter={state.currentChapter}
        selectedChapters={state.selectedChapters}
        tags={state.tags}
        dispatchTagsAction={dispatchTagsAction}
      />
      <AddTagModal addTag={addTag} />
      <DeleteTagModal
        deleteTag={deleteTag}
        currentTag={state.currentTag}
        versesCount={
          state.currentTag ? getTaggedVerses(state.currentTag.tagID) : 0
        }
      />
      <TagsDisplay
        selectedTags={state.selectedTags}
        selectedChapters={state.selectedChapters}
        tags={state.tags}
        versesTags={state.versesTags}
        currentChapter={state.currentChapter}
        dispatchTagsAction={dispatchTagsAction}
      />
      <VerseTagsModal
        tags={state.tags}
        currentVerse={state.currentVerse}
        setCurrentVerse={setCurrentVerse}
        setVerseTags={setVerseTags}
        verseTags={
          state.currentVerse
            ? state.versesTags[state.currentVerse.key]
              ? state.versesTags[state.currentVerse.key]
              : null
            : null
        }
      />
    </div>
  );
}

interface TagsSideProps {
  currentChapter: number;
  selectedChapters: selectedChaptersType;
  tags: tagsProps;
  dispatchTagsAction: Dispatch<tagsActionsProps>;
}

function TagsSide({
  currentChapter,
  selectedChapters,
  tags,
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
    </div>
  );
}

interface TagsDisplayProps {
  selectedTags: tagsProps;
  selectedChapters: selectedChaptersType;
  tags: tagsProps;
  versesTags: versesTagsProps;
  currentChapter: number;
  dispatchTagsAction: Dispatch<tagsActionsProps>;
}

function TagsDisplay({
  selectedTags,
  selectedChapters,
  tags,
  versesTags,
  currentChapter,
  dispatchTagsAction,
}: TagsDisplayProps) {
  const { chapterNames, allQuranText } = useQuran();

  function onClickDeleteSelected(tagID: string) {
    dispatchTagsAction(tagsActions.deselectTag(tagID));
  }

  const chaptersScope = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const asArray = Object.entries(versesTags);

  const filtered = asArray.filter(([key, value]) => {
    const info = key.split("-");
    return selectedChapters[info[0]] === true;
  });

  const selectedVerses = Object.fromEntries(filtered);

  function onClickTagVerse(verse: verseProps) {
    dispatchTagsAction(tagsActions.setCurrentVerse(verse));
  }

  return (
    <div className="tags-display">
      {Object.keys(selectedTags).length > 0 && (
        <>
          <div className="tags-display-tags" dir="ltr">
            <div className="fw-bold">Selected tags:</div>
            <div className="tags-display-tags-list">
              {Object.keys(selectedTags).map((tagID) => (
                <div key={tagID} className="tags-display-tags-list-item">
                  {selectedTags[tagID].tagDisplay}
                  <div
                    onClick={() => onClickDeleteSelected(tagID)}
                    className="tags-display-tags-list-item-close"
                  >
                    X
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="tags-display-chapters" dir="ltr">
            <div className="fw-bold">Selected chapters:</div>
            {chaptersScope.length === 114 ? (
              <div className="fw-bold">All chapters.</div>
            ) : chaptersScope.length === 0 ? (
              <div className="fw-bold">No chapters selected.</div>
            ) : (
              chaptersScope.map((chapterID) => (
                <div className="tags-display-chapters-item" key={chapterID}>
                  {chapterNames[Number(chapterID) - 1].name}
                </div>
              ))
            )}
          </div>
        </>
      )}
      <div className="card tags-display-chapter" dir="rtl">
        {Object.keys(selectedTags).length ? (
          chaptersScope.length ? (
            <SelectedVerses
              selectedTags={selectedTags}
              tags={tags}
              versesTags={selectedVerses}
            />
          ) : (
            <div className="text-center" dir="ltr">
              You have to select at least one chapter.
            </div>
          )
        ) : (
          <>
            <div className="card-header text-center fs-4 tags-display-chapter-title">
              سورة {chapterNames[currentChapter - 1].name}
            </div>
            <div className="card-body tags-display-chapter-verses">
              {allQuranText[currentChapter - 1].verses.map((verse) => (
                <div
                  key={verse.key}
                  className="fs-4 tags-display-chapter-verses-item"
                >
                  {versesTags[verse.key] !== undefined && (
                    <VerseTags versesTags={versesTags[verse.key]} tags={tags} />
                  )}
                  <span className="tags-display-chapter-verses-item-text fs-4">
                    {verse.versetext} ({verse.verseid}){" "}
                  </span>
                  <button
                    className="btn"
                    data-bs-toggle="modal"
                    data-bs-target="#verseTagsModal"
                    onClick={() => onClickTagVerse(verse)}
                  >
                    🏷️
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface SelectedVersesProps {
  selectedTags: tagsProps;
  tags: tagsProps;
  versesTags: versesTagsProps;
}

function SelectedVerses({
  selectedTags,
  versesTags,
  tags,
}: SelectedVersesProps) {
  const { allQuranText, chapterNames } = useQuran();

  function getVerseByKey(key: string) {
    const info = key.split("-");
    return allQuranText[Number(info[0]) - 1].verses[Number(info[1]) - 1];
  }

  const selectedVerses = Object.keys(versesTags).filter((verseKey) =>
    Object.keys(selectedTags).some((tagID) =>
      versesTags[verseKey].includes(tagID)
    )
  );

  const sortedVerses = selectedVerses.sort((keyA, KeyB) => {
    const infoA = keyA.split("-");
    const infoB = KeyB.split("-");
    if (Number(infoA[0]) !== Number(infoB[0]))
      return Number(infoA[0]) - Number(infoB[0]);
    else return Number(infoA[1]) - Number(infoB[1]);
  });

  return (
    <div className="card-body">
      {sortedVerses.length ? (
        <>
          {sortedVerses.map((verseKey) => {
            const verse = getVerseByKey(verseKey);
            return (
              <div key={verseKey} className="tags-display-chapter-verses-item">
                <VerseTags tags={tags} versesTags={versesTags[verse.key]} />
                <span className=" fs-4">
                  {verse.versetext} (
                  {chapterNames[Number(verse.suraid) - 1].name +
                    ":" +
                    verse.verseid}
                  )
                </span>
              </div>
            );
          })}
        </>
      ) : (
        <p className="text-center" dir="ltr">
          There are no verses matching the selected tags.
        </p>
      )}
    </div>
  );
}

interface VerseTagsProps {
  versesTags: string[];
  tags: tagsProps;
}

function VerseTags({ versesTags, tags }: VerseTagsProps) {
  return (
    <div className="fs-6 tags-display-chapter-verses-item-tags">
      {versesTags.map((tagID) => (
        <span
          className="tags-display-chapter-verses-item-tags-item"
          key={tagID}
        >
          {tags[tagID].tagDisplay}
        </span>
      ))}
    </div>
  );
}

export default Tags;
