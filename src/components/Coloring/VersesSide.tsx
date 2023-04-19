import useQuran from "../../context/QuranContext";
import { verseProps } from "../../types";
import { dbDeleteVerseColor, dbSaveVerseColor } from "../../util/db";
import SelectedVerses from "./SelectedVerses";
import VerseModal from "./VerseModal";
import { CL_ACTIONS, colorProps, coloredProps } from "./consts";
import { getTextColor } from "./util";

interface VersesSideProps {
  selectedColors: coloredProps;
  coloredVerses: coloredProps;
  currentChapter: number;
  colorsList: coloredProps;
  currentVerse: verseProps | null;
  dispatchClAction: (action: CL_ACTIONS, payload: any) => void;
}

function VersesSide({
  selectedColors,
  coloredVerses,
  currentChapter,
  colorsList,
  currentVerse,
  dispatchClAction,
}: VersesSideProps) {
  const { chapterNames, allQuranText } = useQuran();

  function onClickDeleteSelected(colorID: string) {
    dispatchClAction(CL_ACTIONS.DESELECT_COLOR, colorID);
  }

  function onClickVerseColor(verse: verseProps) {
    setCurrentVerse(verse);
  }

  function setCurrentVerse(verse: verseProps | null) {
    dispatchClAction(CL_ACTIONS.SET_CURRENT_VERSE, verse);
  }

  function setVerseColor(verseKey: string, color: colorProps | null) {
    if (color === null) {
      dbDeleteVerseColor(verseKey);
    } else {
      dbSaveVerseColor({
        verse_key: verseKey,
        color_id: color.colorID,
      });
    }

    dispatchClAction(CL_ACTIONS.SET_VERSE_COLOR, {
      verseKey: verseKey,
      color: color,
    });
  }

  return (
    <div className="verses-side">
      <div className="verses-side-colors" dir="ltr">
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
            <div>{selectedColors[colorID].colorDisplay}</div>
            <div
              className="verses-side-colors-item-close"
              onClick={(e) => onClickDeleteSelected(colorID)}
            >
              X
            </div>
          </div>
        ))}
      </div>
      <div className="card verse-list fs-4" dir="rtl">
        {Object.keys(selectedColors).length ? (
          <SelectedVerses
            selectedColors={selectedColors}
            coloredVerses={coloredVerses}
          />
        ) : (
          <>
            <div className="card-title">
              سورة {chapterNames[currentChapter - 1].name}
            </div>
            {allQuranText[currentChapter - 1].verses.map((verse) => (
              <div
                className="verse-item"
                key={verse.key}
                style={
                  coloredVerses[verse.key]
                    ? {
                        backgroundColor: coloredVerses[verse.key].colorCode,
                        color: getTextColor(coloredVerses[verse.key].colorCode),
                      }
                    : {}
                }
              >
                {verse.versetext} ({verse.verseid}){" "}
                <button
                  className="verse-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#verseModal"
                  onClick={(e) => onClickVerseColor(verse)}
                >
                  🎨
                </button>
              </div>
            ))}
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

export default VersesSide;
