import { useEffect, useState } from "react";
import { coloredProps } from "./consts";
import { getTextColor } from "./util";

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
    <div
      dir="ltr"
      className="modal fade"
      id="editColorsModal"
      tabIndex={-1}
      aria-labelledby="editColorsModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="editColorsModal">
              Edit colors
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          {currentColor && listColors[currentColor] ? (
            <div className="modal-body">
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
            </div>
          ) : (
            <div className="modal-body">No colors to edit.</div>
          )}
          <div className="modal-footer justify-content-center">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditColorsModal;
