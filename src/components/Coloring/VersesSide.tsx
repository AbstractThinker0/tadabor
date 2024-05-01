import {
  useCallback,
  useEffect,
  memo,
  useRef,
  useTransition,
  useState,
} from "react";

import useQuran from "@/context/useQuran";
import { selectedChaptersType, verseProps } from "@/types";
import { dbFuncs } from "@/util/db";

import { ExpandButton } from "@/components/Generic/Buttons";
import NoteText from "@/components/Custom/NoteText";
import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseModal from "./VerseModal";
import { clActions, clActionsProps, colorProps, coloredProps } from "./consts";
import { getTextColor } from "./util";

interface VersesSideProps {
  selectedColors: coloredProps;
  coloredVerses: coloredProps;
  currentChapter: number;
  colorsList: coloredProps;
  currentVerse: verseProps | null;
  selectedChapters: selectedChaptersType;
  scrollKey: string;
  dispatchClAction: (value: clActionsProps) => void;
}

function VersesSide({
  selectedColors,
  coloredVerses,
  currentChapter,
  colorsList,
  currentVerse,
  scrollKey,
  dispatchClAction,
  selectedChapters,
}: VersesSideProps) {
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  function onClickDeleteSelected(colorID: string) {
    dispatchClAction(clActions.deselectColor(colorID));
  }

  const onClickVerseColor = useCallback(
    (verse: verseProps) => {
      dispatchClAction(clActions.setCurrentVerse(verse));
    },
    [dispatchClAction]
  );

  function setCurrentVerse(verse: verseProps | null) {
    dispatchClAction(clActions.setCurrentVerse(verse));
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

    dispatchClAction(
      clActions.setVerseColor({
        verseKey: verseKey,
        color: color,
      })
    );
  }

  const asArray = Object.entries(coloredVerses);

  const filtered = asArray.filter(([key]) => {
    const info = key.split("-");
    return selectedChapters[info[0]] === true;
  });

  const selectedColoredVerses = Object.fromEntries(filtered);

  const chaptersScope = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const refListVerse = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollKey || !refListVerse.current) return;

    const verseToHighlight = refListVerse.current.querySelector(
      `[data-id="${scrollKey}"]`
    );

    if (verseToHighlight) {
      setTimeout(() => {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
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
    <div className="verses-side">
      <div className="card verse-list" dir="rtl">
        {Object.keys(selectedColors).length ? (
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
                            color: getTextColor(
                              selectedColors[colorID].colorCode
                            ),
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
                selectedColors={selectedColors}
                coloredVerses={selectedColoredVerses}
                dispatchClAction={dispatchClAction}
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
            currentChapter={currentChapter}
            stateVerses={stateVerses}
            coloredVerses={coloredVerses}
            onClickVerseColor={onClickVerseColor}
          />
        )}
        <VerseModal
          colorsList={colorsList}
          currentVerse={currentVerse}
          setVerseColor={setVerseColor}
          setCurrentVerse={setCurrentVerse}
          verseColor={
            currentVerse
              ? coloredVerses[currentVerse.key]
                ? coloredVerses[currentVerse.key]
                : null
              : null
          }
        />
      </div>
    </div>
  );
}

interface VerseComponentProps {
  color: colorProps | null;
  verse: verseProps;
  onClickVerseColor: (verse: verseProps) => void;
}

const VerseComponent = memo(
  ({ verse, onClickVerseColor, color }: VerseComponentProps) => {
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
  }
);

interface SelectedVersesProps {
  coloredVerses: coloredProps;
  selectedColors: coloredProps;

  dispatchClAction: (value: clActionsProps) => void;
}

function SelectedVerses({
  coloredVerses,
  selectedColors,

  dispatchClAction,
}: SelectedVersesProps) {
  const quranService = useQuran();

  const selectedVerses = Object.keys(coloredVerses).filter((verseKey) =>
    Object.keys(selectedColors).includes(coloredVerses[verseKey].colorID)
  );

  function onClickChapter(verse: verseProps) {
    dispatchClAction(clActions.gotoChapter(Number(verse.suraid)));
    dispatchClAction(clActions.setScrollKey(verse.key));
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
  onClickVerseColor: (verse: verseProps) => void;
}

const VersesList = ({
  currentChapter,
  refListVerse,
  stateVerses,
  coloredVerses,
  onClickVerseColor,
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
              onClickVerseColor={onClickVerseColor}
            />
            <NoteText verseKey={verse.key} className="verse-item-note" />
          </div>
        ))}
      </div>
    </>
  );
};

export default VersesSide;
