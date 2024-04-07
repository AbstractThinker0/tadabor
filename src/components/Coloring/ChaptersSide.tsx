import { Dispatch } from "react";

import ChaptersList from "./ChaptersList";
import AddColorModal from "./AddColorModal";
import DeleteColorModal from "./DeleteColorModal";
import EditColorsModal from "./EditColorsModal";
import { clActions, clActionsProps, colorProps, coloredProps } from "./consts";
import { getTextColor } from "./util";
import { dbFuncs } from "@/util/db";
import { selectedChaptersType } from "@/types";

interface ChaptersSideProps {
  currentChapter: number;
  chapterToken: string;
  colorsList: coloredProps;
  currentColor: colorProps | null;
  coloredVerses: coloredProps;
  selectedChapters: selectedChaptersType;
  dispatchClAction: Dispatch<clActionsProps>;
}

function ChaptersSide({
  currentChapter,
  chapterToken,
  colorsList,
  currentColor,
  coloredVerses,
  selectedChapters,
  dispatchClAction,
}: ChaptersSideProps) {
  function onClickSelectColor(color: colorProps) {
    dispatchClAction(clActions.selectColor(color));
  }

  function onClickDeleteColor(color: colorProps) {
    dispatchClAction(clActions.setCurrentColor(color));
  }

  function deleteColor(colorID: string) {
    dispatchClAction(clActions.deleteColor(colorID));
    dbFuncs.deleteColor(colorID);

    for (const verseKey in coloredVerses) {
      if (coloredVerses[verseKey].colorID === colorID) {
        dbFuncs.deleteVerseColor(verseKey);
      }
    }
  }

  function addColor(color: colorProps) {
    dispatchClAction(clActions.addColor(color));
  }

  function setColorsList(colorsList: coloredProps) {
    dispatchClAction(clActions.setColorsList(colorsList));

    Object.keys(colorsList).forEach((colorID) => {
      dbFuncs.saveColor({
        id: colorsList[colorID].colorID,
        name: colorsList[colorID].colorDisplay,
        code: colorsList[colorID].colorCode,
      });
    });

    const newColoredVerses: coloredProps = {};
    Object.keys(coloredVerses).forEach((verseKey) => {
      newColoredVerses[verseKey] = colorsList[coloredVerses[verseKey].colorID];
    });

    dispatchClAction(clActions.setColoredVerses(newColoredVerses));
  }

  return (
    <div className="side">
      <ChaptersList
        chapterToken={chapterToken}
        currentChapter={currentChapter}
        selectedChapters={selectedChapters}
        dispatchClAction={dispatchClAction}
      />
      <div className="side-colors">
        <div className="text-center" dir="ltr">
          Colors list:
        </div>
        {Object.keys(colorsList).length > 0 && (
          <div className="side-colors-list" dir="ltr">
            {Object.keys(colorsList).map((colorID) => (
              <div
                key={colorsList[colorID].colorID}
                className="side-colors-list-item text-center rounded mb-1"
                style={{
                  backgroundColor: colorsList[colorID].colorCode,
                  color: getTextColor(colorsList[colorID].colorCode),
                }}
              >
                <div
                  onClick={() => onClickSelectColor(colorsList[colorID])}
                  className="opacity-0"
                >
                  🗑️
                </div>
                <div
                  className="flex-grow-1 side-colors-list-item-text"
                  onClick={() => onClickSelectColor(colorsList[colorID])}
                >
                  {colorsList[colorID].colorDisplay}
                </div>
                <div
                  data-bs-toggle="modal"
                  data-bs-target="#deleteColorModal"
                  onClick={() => onClickDeleteColor(colorsList[colorID])}
                >
                  🗑️
                </div>
              </div>
            ))}
          </div>
        )}
        <DeleteColorModal
          currentColor={currentColor}
          deleteColor={deleteColor}
          versesCount={
            Object.keys(coloredVerses).filter((verseKey) => {
              return coloredVerses[verseKey]?.colorID === currentColor?.colorID;
            }).length
          }
        />
        <div className="text-center d-flex gap-2" dir="ltr">
          <button
            className="btn btn-dark mt-1"
            data-bs-toggle="modal"
            data-bs-target="#colorsModal"
          >
            New color
          </button>
          <button
            className="btn btn-info mt-1"
            data-bs-toggle="modal"
            data-bs-target="#editColorsModal"
          >
            Edit colors
          </button>
        </div>
        <AddColorModal addColor={addColor} />
        <EditColorsModal
          colorsList={{ ...colorsList }}
          setColorsList={setColorsList}
        />
      </div>
    </div>
  );
}

export default ChaptersSide;
