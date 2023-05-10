import { Dispatch } from "react";
import { selectedChaptersType, verseProps } from "../../types";
import {
  tagsActions,
  tagsActionsProps,
  tagsProps,
  versesTagsProps,
} from "./consts";
import useQuran from "../../context/QuranContext";
import { dbFuncs } from "../../util/db";
import VerseTagsModal from "./VerseTagsModal";

interface TagsDisplayProps {
  selectedTags: tagsProps;
  selectedChapters: selectedChaptersType;
  tags: tagsProps;
  versesTags: versesTagsProps;
  currentChapter: number;
  currentVerse: verseProps | null;
  dispatchTagsAction: Dispatch<tagsActionsProps>;
}

function TagsDisplay({
  selectedTags,
  selectedChapters,
  tags,
  versesTags,
  currentChapter,
  currentVerse,
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
      <VerseTagsModal
        tags={tags}
        currentVerse={currentVerse}
        setCurrentVerse={setCurrentVerse}
        setVerseTags={setVerseTags}
        verseTags={
          currentVerse
            ? versesTags[currentVerse.key]
              ? versesTags[currentVerse.key]
              : null
            : null
        }
      />
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

export default TagsDisplay;
