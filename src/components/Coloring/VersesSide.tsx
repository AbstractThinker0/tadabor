import { useEffect, memo, useRef, useTransition, useState } from "react";

import useQuran from "@/context/useQuran";
import { verseProps } from "@/types";
import { dbFuncs } from "@/util/db";

import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { ExpandButton } from "@/components/Generic/Buttons";
import NoteText from "@/components/Custom/NoteText";
import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseModal from "./VerseModal";
import { colorProps, coloredProps } from "./consts";
import { getTextColor } from "./util";

const VersesSide = () => {
  const coloringState = useAppSelector((state) => state.coloringPage);
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  function onClickDeleteSelected(colorID: string) {
    dispatch(coloringPageActions.deselectColor(colorID));
  }

  function setVerseColor(verseKey: string, color: colorProps | null) {
    if (color === null) {
      dbFuncs.deleteVerseColor(verseKey);
    } else {
      dbFuncs.saveVerseColor({
        verse_key: verseKey,
        color_id: color.colorID,
      });
    }

    dispatch(
      coloringPageActions.setVerseColor({
        verseKey: verseKey,
        color: color,
      })
    );
  }

  const asArray = Object.entries(coloringState.coloredVerses);

  const filtered = asArray.filter(([key]) => {
    const info = key.split("-");
    return coloringState.selectedChapters[info[0]] === true;
  });

  const selectedColoredVerses = Object.fromEntries(filtered);

  const chaptersScope = Object.keys(coloringState.selectedChapters).filter(
    (chapterID) => coloringState.selectedChapters[chapterID] === true
  );

  const refListVerse = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!coloringState.scrollKey || !refListVerse.current) return;

    const verseToHighlight = refListVerse.current.querySelector(
      `[data-id="${coloringState.scrollKey}"]`
    );

    if (verseToHighlight) {
      setTimeout(() => {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, [coloringState.scrollKey, isPending]);

  useEffect(() => {
    //
    startTransition(() => {
      setStateVerses(quranService.getVerses(coloringState.currentChapter));
    });
  }, [coloringState.currentChapter]);

  return (
    <div className="verses-side">
      <div className="card verse-list" dir="rtl">
        {Object.keys(coloringState.selectedColors).length ? (
          <>
            <div className="verses-side-colors" dir="ltr">
              <div className="verses-side-colors-selected">
                <div className="fw-bold">Selected colors:</div>
                {Object.keys(coloringState.selectedColors).map((colorID) => (
                  <div
                    key={colorID}
                    className="verses-side-colors-item text-center rounded"
                    style={
                      coloringState.selectedColors[colorID]
                        ? {
                            backgroundColor:
                              coloringState.selectedColors[colorID].colorCode,
                            color: getTextColor(
                              coloringState.selectedColors[colorID].colorCode
                            ),
                          }
                        : {}
                    }
                  >
                    <div></div>
                    <div className="verses-side-colors-item-text">
                      {coloringState.selectedColors[colorID].colorDisplay}
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
                    <div
                      key={chapterID}
                      className="verses-side-colors-chapters-item"
                    >
                      {quranService.getChapterName(chapterID)}
                    </div>
                  ))
                )}
              </div>
            </div>
            {chaptersScope.length ? (
              <SelectedVerses
                selectedColors={coloringState.selectedColors}
                coloredVerses={selectedColoredVerses}
              />
            ) : (
              <div className="text-center" dir="ltr">
                You have to select at least one chapter.
              </div>
            )}
          </>
        ) : isPending ? (
          <LoadingSpinner />
        ) : (
          <VersesList
            currentChapter={coloringState.currentChapter}
            stateVerses={stateVerses}
            coloredVerses={coloringState.coloredVerses}
          />
        )}
        <VerseModal
          colorsList={coloringState.colorsList}
          currentVerse={coloringState.currentVerse}
          setVerseColor={setVerseColor}
          verseColor={
            coloringState.currentVerse
              ? coloringState.coloredVerses[coloringState.currentVerse.key]
                ? coloringState.coloredVerses[coloringState.currentVerse.key]
                : null
              : null
          }
        />
      </div>
    </div>
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

  return (
    <>
      <VerseContainer>
        {verse.versetext} ({verse.verseid}){" "}
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
                      (
                      {quranService.getChapterName(verse.suraid) +
                        ":" +
                        verse.verseid}
                      )
                    </span>
                  </VerseContainer>
                  <ExpandButton
                    identifier={verse.key}
                    style={{
                      backgroundColor: coloredVerses[verseKey].colorCode,
                      color: getTextColor(coloredVerses[verseKey].colorCode),
                    }}
                  />
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

interface VersesListProps {
  currentChapter: number;
  refListVerse?: React.RefObject<HTMLDivElement>;
  stateVerses: verseProps[];
  coloredVerses: coloredProps;
}

const VersesList = ({
  currentChapter,
  refListVerse,
  stateVerses,
  coloredVerses,
}: VersesListProps) => {
  const quranService = useQuran();
  return (
    <>
      <div className="card-title">
        سورة {quranService.getChapterName(currentChapter)}
      </div>
      <div ref={refListVerse}>
        {stateVerses.map((verse) => (
          <div
            className="verse-item"
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

export default VersesSide;
