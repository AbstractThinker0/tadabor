import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { dbFuncs } from "@/util/db";

import { coloredProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/Generic/Modal";

const EditColorsModal = () => {
  const colorsList = useAppSelector((state) => state.coloringPage.colorsList);
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );

  const dispatch = useAppDispatch();

  const [listColors, setListColors] = useState({ ...colorsList });
  const [currentColor, setCurrentColor] = useState(
    Object.keys(colorsList).length
      ? colorsList[Object.keys(colorsList)[0]].colorID
      : undefined
  );

  useEffect(() => {
    setListColors({ ...colorsList });

    if (Object.keys(colorsList)[0]) {
      setCurrentColor(colorsList[Object.keys(colorsList)[0]].colorID);
    }
  }, [colorsList]);

  function onChangeColor(event: React.ChangeEvent<HTMLSelectElement>) {
    setCurrentColor(event.target.value);
  }

  function onInputColor(event: React.FormEvent<HTMLInputElement>) {
    const newColorsList = { ...listColors };

    newColorsList[event.currentTarget.name] = {
      ...newColorsList[event.currentTarget.name],
      colorCode: event.currentTarget.value,
    };

    setListColors(newColorsList);
  }

  function onClickSave() {
    dispatch(coloringPageActions.setColorsList(listColors));

    Object.keys(listColors).forEach((colorID) => {
      dbFuncs.saveColor({
        id: listColors[colorID].colorID,
        name: listColors[colorID].colorDisplay,
        code: listColors[colorID].colorCode,
      });
    });

    const newColoredVerses: coloredProps = {};
    Object.keys(coloredVerses).forEach((verseKey) => {
      newColoredVerses[verseKey] = listColors[coloredVerses[verseKey].colorID];
    });

    dispatch(coloringPageActions.setColoredVerses(newColoredVerses));
  }

  return (
    <ModalContainer identifier="editColorsModal">
      <ModalHeader identifier="editColorsModal" title="Edit colors" />
      <ModalBody>
        {currentColor && listColors[currentColor] ? (
          <>
            <div className="d-flex gap-3 align-items-center pb-2">
              <div>Name:</div>
              <select
                className="form-select"
                size={1}
                aria-label="size 1 select example"
                onChange={onChangeColor}
                value={currentColor}
                style={{
                  backgroundColor: listColors[currentColor].colorCode,
                  color: getTextColor(listColors[currentColor].colorCode),
                }}
              >
                {Object.keys(listColors).map((colorID) => (
                  <option
                    key={listColors[colorID].colorID}
                    value={listColors[colorID].colorID}
                    style={{
                      backgroundColor: listColors[colorID].colorCode,
                      color: getTextColor(listColors[colorID].colorCode),
                    }}
                  >
                    {listColors[colorID].colorDisplay}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex gap-3">
              <label>Color: </label>
              <input
                onInput={onInputColor}
                name={currentColor}
                id="inputColor"
                type="color"
                value={listColors[currentColor].colorCode}
              />
            </div>
          </>
        ) : (
          <>No colors to edit.</>
        )}
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          No, Cancel
        </button>
        <button
          type="button"
          className="btn btn-info"
          data-bs-dismiss="modal"
          onClick={onClickSave}
        >
          Save changes
        </button>
      </ModalFooter>
    </ModalContainer>
  );
};

export default EditColorsModal;
