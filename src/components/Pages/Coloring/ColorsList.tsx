import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { getTextColor } from "@/components/Pages/Coloring/util";

import { colorProps } from "@/components/Pages/Coloring/consts";

const ColorsList = () => {
  const coloringState = useAppSelector((state) => state.coloringPage);
  const dispatch = useAppDispatch();

  function onClickSelectColor(color: colorProps) {
    dispatch(coloringPageActions.selectColor(color));
  }

  function onClickDeleteColor(color: colorProps) {
    dispatch(coloringPageActions.setCurrentColor(color));
  }

  const getColoredVerses = (colorID: string | undefined) => {
    if (!colorID) return 0;

    return Object.keys(coloringState.coloredVerses).filter((verseKey) => {
      return coloringState.coloredVerses[verseKey]?.colorID === colorID;
    }).length;
  };

  return (
    <>
      <div className="text-center" dir="ltr">
        Colors list:
      </div>
      {Object.keys(coloringState.colorsList).length > 0 && (
        <div className="side-colors-list" dir="ltr">
          {Object.keys(coloringState.colorsList).map((colorID) => (
            <div
              key={coloringState.colorsList[colorID].colorID}
              className="side-colors-list-item text-center rounded mb-1"
              style={{
                backgroundColor: coloringState.colorsList[colorID].colorCode,
                color: getTextColor(
                  coloringState.colorsList[colorID].colorCode
                ),
              }}
            >
              <div
                onClick={() =>
                  onClickSelectColor(coloringState.colorsList[colorID])
                }
                className="opacity-0"
              >
                🗑️
              </div>
              <div
                className="flex-grow-1 side-colors-list-item-text"
                onClick={() =>
                  onClickSelectColor(coloringState.colorsList[colorID])
                }
              >
                {coloringState.colorsList[colorID].colorDisplay} (
                {getColoredVerses(colorID)})
              </div>
              <div
                data-bs-toggle="modal"
                data-bs-target="#deleteColorModal"
                onClick={() =>
                  onClickDeleteColor(coloringState.colorsList[colorID])
                }
              >
                🗑️
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ColorsList;
