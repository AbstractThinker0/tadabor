import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { colorProps } from "./consts";
import { useAppDispatch } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";
import { dbFuncs } from "@/util/db";

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/Generic/Modal";

const AddColorModal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
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

    dispatch(coloringPageActions.addColor(newColor));

    dbFuncs
      .saveColor({
        id: newColor.colorID,
        name: newColor.colorDisplay,
        code: newColor.colorCode,
      })
      .then(function () {
        toast.success(t("save_success"));
      })
      .catch(function () {
        toast.error(t("save_failed"));
      });

    setColorName("");
    setColorCode("#000000");
    refCloseButton.current?.click();
  }

  return (
    <ModalContainer identifier="colorsModal">
      <ModalHeader identifier="colorsModal" title="Add a new color" />
      <ModalBody>
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
      </ModalBody>
      <ModalFooter>
        <button
          ref={refCloseButton}
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Close
        </button>
        <button type="button" className="btn btn-primary" onClick={onClickSave}>
          Save changes
        </button>
      </ModalFooter>
    </ModalContainer>
  );
};

export default AddColorModal;
