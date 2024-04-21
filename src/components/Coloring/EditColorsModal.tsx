import { useEffect, useState } from "react";
import { coloredProps } from "./consts";
import { getTextColor } from "./util";

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/Generic/Modal";

interface EditColorsModalProps {
  colorsList: coloredProps;
  setColorsList: (colorsList: coloredProps) => void;
}

function EditColorsModal({ colorsList, setColorsList }: EditColorsModalProps) {
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
    setColorsList(listColors);
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
}

export default EditColorsModal;
