import { useCallback, useEffect, memo, useRef } from "react";

import useQuran from "../../context/QuranContext";
import { selectedChaptersType, verseProps } from "../../types";
import { dbFuncs } from "../../util/db";
import VerseModal from "./VerseModal";
import { clActions, clActionsProps, colorProps, coloredProps } from "./consts";
import { getTextColor } from "./util";
import { IconCircleArrowDownFilled } from "@tabler/icons-react";

import NoteText from "../NoteText";

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
  const { chapterNames, allQuranText } = useQuran();

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

  const filtered = asArray.filter(([key, value]) => {
    const info = key.split("-");
    return selectedChapters[info[0]] === true;
  });

  const selectedColoredVerses = Object.fromEntries(filtered);

  const chaptersScope = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedCount = chaptersScope.length;

  const refListVerse = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const verseToHighlight = scrollKey
      ? refListVerse.current?.querySelector(`[data-id="${scrollKey}"]`)
      : "";

    if (verseToHighlight) {
      setTimeout(() => {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, [scrollKey]);

  return (
    <div className="verses-side">
      {Object.keys(selectedColors).length > 0 && (
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
                  onClick={(e) => onClickDeleteSelected(colorID)}
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
                  {chapterNames[Number(chapterID) - 1].name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <div className="card verse-list fs-4" dir="rtl">
        {Object.keys(selectedColors).length ? (
          getSelectedCount ? (
            <SelectedVerses
              selectedColors={selectedColors}
              coloredVerses={selectedColoredVerses}
              dispatchClAction={dispatchClAction}
            />
          ) : (
            <div className="text-center" dir="ltr">
              You have to select at least one chapter.
            </div>
          )
        ) : (
          <>
            <div className="card-title">
              سورة {chapterNames[currentChapter - 1].name}
            </div>
            <div ref={refListVerse}>
              {allQuranText[currentChapter - 1].verses.map((verse) => (
                <div
                  className="verse-item"
                  key={verse.key}
                  data-id={verse.key}
                  style={
                    coloredVerses[verse.key]
                      ? {
                          backgroundColor: coloredVerses[verse.key].colorCode,
                          color: getTextColor(
                            coloredVerses[verse.key].colorCode
                          ),
                        }
                      : {}
                  }
                >
                  <VerseComponent
                    color={
                      coloredVerses[verse.key] ? coloredVerses[verse.key] : null
                    }
                    verse={verse}
                    onClickVerseColor={onClickVerseColor}
                  />
                  <NoteText verseKey={verse.key} className="verse-item-note" />
                </div>
              ))}
            </div>
          </>
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
      <div>
        {verse.versetext} ({verse.verseid}){" "}
        <button
          className="verse-btn"
          data-bs-toggle="modal"
          data-bs-target="#verseModal"
          onClick={(e) => onClickVerseColor(verse)}
        >
          🎨
        </button>
        <button
          className="btn"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={"#collapseExample" + verse.key}
          aria-expanded="false"
          aria-controls={"collapseExample" + verse.key}
          style={
            color
              ? {
                  backgroundColor: color.colorCode,
                  color: getTextColor(color.colorCode),
                }
              : {}
          }
        >
          <IconCircleArrowDownFilled />
        </button>
      </div>
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
  const { allQuranText, chapterNames } = useQuran();

  function getVerseByKey(key: string) {
    const info = key.split("-");
    return allQuranText[Number(info[0]) - 1].verses[Number(info[1]) - 1];
  }

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
            const verse = getVerseByKey(verseKey);
            return (
              <div
                className="verse-item"
                key={verseKey}
                style={{
                  backgroundColor: coloredVerses[verseKey].colorCode,
                  color: getTextColor(coloredVerses[verseKey].colorCode),
                }}
              >
                <div>
                  {verse.versetext}{" "}
                  <span
                    onClick={() => onClickChapter(verse)}
                    className="verse-item-chapter"
                  >
                    (
                    {chapterNames[Number(verse.suraid) - 1].name +
                      ":" +
                      verse.verseid}
                    )
                  </span>
                  <button
                    className="btn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={"#collapseExample" + verse.key}
                    aria-expanded="false"
                    aria-controls={"collapseExample" + verse.key}
                    style={{
                      backgroundColor: coloredVerses[verseKey].colorCode,
                      color: getTextColor(coloredVerses[verseKey].colorCode),
                    }}
                  >
                    <IconCircleArrowDownFilled />
                  </button>
                </div>
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

export default VersesSide;
