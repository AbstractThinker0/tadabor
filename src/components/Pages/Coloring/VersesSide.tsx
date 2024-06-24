import { useEffect, memo, useRef, useTransition, useState } from "react";

import useQuran from "@/context/useQuran";
import { verseProps } from "@/types";

import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { ExpandButton } from "@/components/Generic/Buttons";
import NoteText from "@/components/Custom/NoteText";
import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseModal from "@/components/Pages/Coloring/VerseModal";
import { colorProps, coloredProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

const VersesSide = () => {
  const selectedColors = useAppSelector(
    (state) => state.coloringPage.selectedColors
  );

  return (
    <div className="verses-side">
      <div className="card verse-list" dir="rtl">
        {Object.keys(selectedColors).length ? (
          <SelectedContainter />
        ) : (
          <VersesList />
        )}
      </div>
      <VerseModal />
    </div>
  );
};

const SelectedContainter = () => {
  const selectedChapters = useAppSelector(
    (state) => state.coloringPage.selectedChapters
  );
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );
  const selectedColors = useAppSelector(
    (state) => state.coloringPage.selectedColors
  );

  const dispatch = useAppDispatch();
  const quranService = useQuran();

  function onClickDeleteSelected(colorID: string) {
    dispatch(coloringPageActions.deselectColor(colorID));
  }

  const chaptersScope = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedColoredVerses = () => {
    const asArray = Object.entries(coloredVerses);

    const filtered = asArray.filter(([key]) => {
      const info = key.split("-");
      return selectedChapters[info[0]] === true;
    });

    return Object.fromEntries(filtered);
  };

  return (
    <>
      <div className="verses-side-colors" dir="ltr">
        <div className="verses-side-colors-selected">
          <div className="fw-bold">Selected colors:</div>
          {Object.keys(selectedColors).map((colorID) => (
            <div
              key={colorID}
              className="verses-side-colors-item text-center rounded"
              style={
                selectedColors[colorID]
                  ? {
                      backgroundColor: selectedColors[colorID].colorCode,
                      color: getTextColor(selectedColors[colorID].colorCode),
                    }
                  : {}
              }
            >
              <div></div>
              <div className="verses-side-colors-item-text">
                {selectedColors[colorID].colorDisplay}
              </div>
              <div
                className="verses-side-colors-item-close"
                onClick={() => onClickDeleteSelected(colorID)}
              >
                X
              </div>
            </div>
          ))}
        </div>
        <div className="verses-side-colors-chapters">
          <div className="fw-bold">Selected chapters:</div>
          {chaptersScope.length === 114 ? (
            <div className="fw-bold">All chapters.</div>
          ) : chaptersScope.length === 0 ? (
            <div className="fw-bold">No chapters selected.</div>
          ) : (
            chaptersScope.map((chapterID) => (
              <div key={chapterID} className="verses-side-colors-chapters-item">
                {quranService.getChapterName(chapterID)}
              </div>
            ))
          )}
        </div>
      </div>
      {chaptersScope.length ? (
        <SelectedVerses
          selectedColors={selectedColors}
          coloredVerses={getSelectedColoredVerses()}
        />
      ) : (
        <div className="text-center" dir="ltr">
          You have to select at least one chapter.
        </div>
      )}
    </>
  );
};

interface SelectedVersesProps {
  coloredVerses: coloredProps;
  selectedColors: coloredProps;
}

function SelectedVerses({
  coloredVerses,
  selectedColors,
}: SelectedVersesProps) {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const selectedVerses = Object.keys(coloredVerses).filter((verseKey) =>
    Object.keys(selectedColors).includes(coloredVerses[verseKey].colorID)
  );

  function onClickChapter(verse: verseProps) {
    dispatch(coloringPageActions.gotoChapter(Number(verse.suraid)));
    dispatch(coloringPageActions.setScrollKey(verse.key));
  }

  const onClickVerseColor = (verse: verseProps) => {
    dispatch(coloringPageActions.setCurrentVerse(verse));
  };

  return (
    <div>
      {selectedVerses.length ? (
        selectedVerses
          .sort((keyA, KeyB) => {
            const infoA = keyA.split("-");
            const infoB = KeyB.split("-");
            if (Number(infoA[0]) !== Number(infoB[0]))
              return Number(infoA[0]) - Number(infoB[0]);
            else return Number(infoA[1]) - Number(infoB[1]);
          })
          .map((verseKey) => {
            const verse = quranService.getVerseByKey(verseKey);
            return (
              <div
                className="verse-item"
                key={verseKey}
                style={{
                  backgroundColor: coloredVerses[verseKey].colorCode,
                  color: getTextColor(coloredVerses[verseKey].colorCode),
                }}
              >
                <>
                  <VerseContainer>
                    {verse.versetext}{" "}
                    <span
                      onClick={() => onClickChapter(verse)}
                      className="verse-item-chapter"
                    >
                      {`(${quranService.getChapterName(verse.suraid)}:${
                        verse.verseid
                      })`}
                    </span>
                  </VerseContainer>
                  <ExpandButton
                    identifier={verse.key}
                    style={{
                      backgroundColor: coloredVerses[verseKey].colorCode,
                      color: getTextColor(coloredVerses[verseKey].colorCode),
                    }}
                  />
                  <button
                    className="verse-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#verseModal"
                    onClick={() => onClickVerseColor(verse)}
                  >
                    🎨
                  </button>
                </>
                <NoteText verseKey={verse.key} className="verse-item-note" />
              </div>
            );
          })
      ) : (
        <p className="text-center" dir="ltr">
          There are no verses matching the selected colors.
        </p>
      )}
    </div>
  );
}

const VersesList = () => {
  const scrollKey = useAppSelector((state) => state.coloringPage.scrollKey);
  const currentChapter = useAppSelector(
    (state) => state.coloringPage.currentChapter
  );
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );

  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  const refListVerse = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollKey || !refListVerse.current) return;

    const verseToHighlight = refListVerse.current.querySelector(
      `[data-id="${scrollKey}"]`
    );

    setTimeout(() => {
      if (verseToHighlight) {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  }, [scrollKey, isPending]);

  useEffect(() => {
    //
    startTransition(() => {
      setStateVerses(quranService.getVerses(currentChapter));
    });
  }, [currentChapter]);

  if (isPending) return <LoadingSpinner />;

  return (
    <>
      <div className="card-title">
        سورة {quranService.getChapterName(currentChapter)}
      </div>
      <div ref={refListVerse}>
        {stateVerses.map((verse) => (
          <div
            className={`verse-item ${
              scrollKey === verse.key ? "verse-item-selected" : ""
            }`}
            key={verse.key}
            data-id={verse.key}
            style={
              coloredVerses[verse.key]
                ? {
                    backgroundColor: coloredVerses[verse.key].colorCode,
                    color: getTextColor(coloredVerses[verse.key].colorCode),
                  }
                : {}
            }
          >
            <VerseComponent
              color={coloredVerses[verse.key] ? coloredVerses[verse.key] : null}
              verse={verse}
            />
            <NoteText verseKey={verse.key} className="verse-item-note" />
          </div>
        ))}
      </div>
    </>
  );
};

interface VerseComponentProps {
  color: colorProps | null;
  verse: verseProps;
}

const VerseComponent = memo(({ verse, color }: VerseComponentProps) => {
  const dispatch = useAppDispatch();

  const onClickVerseColor = (verse: verseProps) => {
    dispatch(coloringPageActions.setCurrentVerse(verse));
  };

  function onClickVerse() {
    dispatch(coloringPageActions.setScrollKey(verse.key));
  }

  return (
    <>
      <VerseContainer>
        {verse.versetext}{" "}
        <span className="verse-item-text-btn" onClick={onClickVerse}>
          ({verse.verseid})
        </span>{" "}
      </VerseContainer>
      <ExpandButton
        identifier={verse.key}
        style={
          color
            ? {
                backgroundColor: color.colorCode,
                color: getTextColor(color.colorCode),
              }
            : {}
        }
      />
      <button
        className="verse-btn"
        data-bs-toggle="modal"
        data-bs-target="#verseModal"
        onClick={() => onClickVerseColor(verse)}
      >
        🎨
      </button>
    </>
  );
});

VerseComponent.displayName = "VerseComponent";

export default VersesSide;
