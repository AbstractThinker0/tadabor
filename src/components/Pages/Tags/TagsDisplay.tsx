import { memo, useEffect, useRef, useState, useTransition } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { verseProps } from "@/types";
import useQuran from "@/context/useQuran";
import { dbFuncs } from "@/util/db";

import { ExpandButton } from "@/components/Generic/Buttons";
import NoteText from "@/components/Custom/NoteText";
import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { tagsProps, versesTagsProps } from "@/components/Pages/Tags/consts";
import VerseTagsModal from "@/components/Pages/Tags/VerseTagsModal";

function TagsDisplay() {
  const quranService = useQuran();
  const dispatch = useAppDispatch();

  const selectedTags = useAppSelector((state) => state.tagsPage.selectedTags);

  const selectedChapters = useAppSelector(
    (state) => state.tagsPage.selectedChapters
  );

  const tags = useAppSelector((state) => state.tagsPage.tags);

  const versesTags = useAppSelector((state) => state.tagsPage.versesTags);

  const currentVerse = useAppSelector((state) => state.tagsPage.currentVerse);

  function onClickDeleteSelected(tagID: string) {
    dispatch(tagsPageActions.deselectTag(tagID));
  }

  const chaptersScope = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedVerses = () => {
    const asArray = Object.entries(versesTags);

    const filtered = asArray.filter(([key]) => {
      const info = key.split("-");
      return selectedChapters[info[0]] === true;
    });

    return Object.fromEntries(filtered);
  };

  function setCurrentVerse(verse: verseProps | null) {
    dispatch(tagsPageActions.setCurrentVerse(verse));
  }

  function setVerseTags(verseKey: string, tags: string[] | null) {
    if (tags === null) {
      dbFuncs.deleteVerseTags(verseKey);
    } else {
      dbFuncs.saveVerseTags({ verse_key: verseKey, tags_ids: tags });
    }

    dispatch(tagsPageActions.setVerseTags({ verseKey, tags }));
  }

  return (
    <div className="tags-display">
      <div className="card tags-display-chapter" dir="rtl">
        {Object.keys(selectedTags).length ? (
          <>
            <div className="tags-display-header">
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
                      {quranService.getChapterName(chapterID)}
                    </div>
                  ))
                )}
              </div>
            </div>
            {chaptersScope.length ? (
              <SelectedVerses
                selectedTags={selectedTags}
                tags={tags}
                versesTags={getSelectedVerses()}
              />
            ) : (
              <div className="text-center" dir="ltr">
                You have to select at least one chapter.
              </div>
            )}
          </>
        ) : (
          <ListVerses versesTags={versesTags} tags={tags} />
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
  const quranService = useQuran();

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
            const verse = quranService.getVerseByKey(verseKey);
            return (
              <div key={verseKey} className="tags-display-chapter-verses-item">
                <VerseTags tags={tags} versesTags={versesTags[verse.key]} />
                <SelectedVerseComponent verse={verse} />
                <NoteText verseKey={verse.key} />
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

interface SelectedVerseComponentProps {
  verse: verseProps;
}

const SelectedVerseComponent = ({ verse }: SelectedVerseComponentProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  function onClickVerse(verse: verseProps) {
    dispatch(tagsPageActions.gotoChapter(verse.suraid));
    dispatch(tagsPageActions.setScrollKey(verse.key));
  }

  function onClickTagVerse(verse: verseProps) {
    dispatch(tagsPageActions.setCurrentVerse(verse));
  }

  return (
    <>
      <VerseContainer>
        {verse.versetext}{" "}
        <span
          onClick={() => onClickVerse(verse)}
          className="tags-display-chapter-verses-item-verse"
        >
          ({`${quranService.getChapterName(verse.suraid)}:${verse.verseid}`})
        </span>
      </VerseContainer>
      <ExpandButton identifier={verse.key} />
      <button
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#verseTagsModal"
        onClick={() => onClickTagVerse(verse)}
      >
        🏷️
      </button>
    </>
  );
};

interface ListVersesProps {
  versesTags: versesTagsProps;
  tags: tagsProps;
}

const ListVerses = memo(({ versesTags, tags }: ListVersesProps) => {
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  const listRef = useRef<HTMLDivElement>(null);

  const currentChapter = useAppSelector(
    (state) => state.tagsPage.currentChapter
  );

  const scrollKey = useAppSelector((state) => state.tagsPage.scrollKey);

  useEffect(() => {
    const verseToHighlight = scrollKey
      ? listRef.current?.querySelector(`[data-id="${scrollKey}"]`)
      : "";

    if (verseToHighlight) {
      verseToHighlight.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [scrollKey, isPending]);

  useEffect(() => {
    //
    startTransition(() => {
      setStateVerses(quranService.getVerses(currentChapter));
    });
  }, [currentChapter]);

  return (
    <>
      <div className="card-header text-center fs-3 tags-display-chapter-title">
        سورة {quranService.getChapterName(currentChapter)}
      </div>
      <div className="card-body tags-display-chapter-verses" ref={listRef}>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          stateVerses.map((verse) => (
            <div
              key={verse.key}
              data-id={verse.key}
              className={`tags-display-chapter-verses-item ${
                scrollKey === verse.key
                  ? "tags-display-chapter-verses-item-highlighted"
                  : ""
              }`}
            >
              {versesTags[verse.key] !== undefined && (
                <VerseTags versesTags={versesTags[verse.key]} tags={tags} />
              )}
              <ListVerseComponent verse={verse} />
              <NoteText verseKey={verse.key} />
            </div>
          ))
        )}
      </div>
    </>
  );
});

ListVerses.displayName = "ListVerses";

interface ListVerseComponentProps {
  verse: verseProps;
}

const ListVerseComponent = memo(({ verse }: ListVerseComponentProps) => {
  const dispatch = useAppDispatch();

  function onClickTagVerse(verse: verseProps) {
    dispatch(tagsPageActions.setCurrentVerse(verse));
  }

  function onClickVerse() {
    dispatch(tagsPageActions.setScrollKey(verse.key));
  }

  return (
    <>
      <VerseContainer extraClass="tags-display-chapter-verses-item-text">
        {verse.versetext}{" "}
        <span
          className="tags-display-chapter-verses-item-text-btn"
          onClick={onClickVerse}
        >
          ({verse.verseid})
        </span>{" "}
      </VerseContainer>
      <ExpandButton identifier={verse.key} />
      <button
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#verseTagsModal"
        onClick={() => onClickTagVerse(verse)}
      >
        🏷️
      </button>
    </>
  );
});

ListVerseComponent.displayName = "ListVerseComponent";

interface VerseTagsProps {
  versesTags: string[];
  tags: tagsProps;
}

function VerseTags({ versesTags, tags }: VerseTagsProps) {
  return (
    <div className="fs-5 tags-display-chapter-verses-item-tags">
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
