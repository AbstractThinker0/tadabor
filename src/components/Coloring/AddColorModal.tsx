import { useRef, useState } from "react";
import { colorProps } from "./consts";
import { dbFuncs } from "../../util/db";

interface ColorModalProps {
  addColor: (color: colorProps) => void;
}

const AddColorModal = ({ addColor }: ColorModalProps) => {
  const refCloseButton = useRef<HTMLButtonElement>(null);
  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("#000000");

  function onChangeName(event: React.ChangeEvent<HTMLInputElement>) {
    setColorName(event.target.value);
  }

  function onInputColor(event: React.FormEvent<HTMLInputElement>) {
    setColorCode(event.currentTarget.value);
  }

  function onClickSave() {
    if (!colorName) {
      alert("Please enter the color display name");
      return;
    }

    const newColor: colorProps = {
      colorID: Date.now().toString(),
      colorCode: colorCode,
      colorDisplay: colorName,
    };

    addColor(newColor);

    dbFuncs.saveColor({
      id: newColor.colorID,
      name: newColor.colorDisplay,
      code: newColor.colorCode,
    });

    setColorName("");
    setColorCode("#000000");
    refCloseButton.current?.click();
  }

  return (
    <div
      className="modal fade"
      id="colorsModal"
      tabIndex={-1}
      aria-labelledby="colorsModalLabel"
      aria-hidden="true"
      dir="ltr"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="colorsModalLabel">
              Add a new color
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="pb-1">
              <label className="w-25">Display name: </label>
              <input
                type="text"
                placeholder="display name"
                value={colorName}
                onChange={onChangeName}
              />
            </div>
            <div>
              <label className="w-25" htmlFor="inputColor">
                Color:
              </label>
              <input
                onInput={onInputColor}
                id="inputColor"
                type="color"
                value={colorCode}
              />
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              ref={refCloseButton}
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClickSave}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddColorModal;
