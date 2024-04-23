import { useEffect, useRef, useState } from "react";

import { verseProps } from "@/types";
import useQuran from "@/context/useQuran";

import { colorProps, coloredProps } from "./consts";
import { getTextColor } from "./util";

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/Generic/Modal";

const activeClassName = "verse-modal-colors-item-active";

interface VerseModalProps {
  colorsList: coloredProps;
  currentVerse: verseProps | null;
  setVerseColor: (verseKey: string, color: colorProps | null) => void;
  setCurrentVerse: (verse: verseProps | null) => void;
  verseColor: colorProps | null;
}

const VerseModal = ({
  colorsList,
  currentVerse,
  setVerseColor,
  verseColor,
  setCurrentVerse,
}: VerseModalProps) => {
  const quranService = useQuran();
  const refVerseModal = useRef<HTMLDivElement>(null);

  const [chosenColor, setChosenColor] = useState(verseColor);

  useEffect(() => {
    setChosenColor(verseColor);
  }, [verseColor]);

  useEffect(() => {
    const modelElement = refVerseModal.current;
    if (modelElement === null) return;

    function onModalHide() {
      setChosenColor(null);
      setCurrentVerse(null);
    }

    modelElement.addEventListener("hide.bs.modal", onModalHide);

    return () => {
      if (modelElement) {
        modelElement.removeEventListener("hide.bs.modal", onModalHide);
      }
    };
  }, [setCurrentVerse]);

  function onClickSave() {
    if (currentVerse?.key) setVerseColor(currentVerse.key, chosenColor);
  }

  function onClickColor(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    color: colorProps
  ) {
    if (color.colorID === chosenColor?.colorID) {
      setChosenColor(null);
      return;
    }

    setChosenColor(color);
  }

  return (
    <ModalContainer
      identifier="verseModal"
      extraClass="verse-modal"
      dialogClass="modal-lg"
      refModal={refVerseModal}
    >
      <ModalHeader identifier="verseModal" title="Choose verse color" />
      <ModalBody>
        <div className="verse-modal-title text-center">
          (
          {currentVerse
            ? quranService.getChapterName(currentVerse.suraid) +
              ":" +
              currentVerse.verseid
            : ""}
          )
        </div>
        <div
          className="verse-modal-text text-center rounded"
          style={
            chosenColor
              ? {
                  backgroundColor: chosenColor.colorCode,
                  color: getTextColor(chosenColor.colorCode),
                }
              : {}
          }
        >
          {currentVerse?.versetext}
        </div>
        <div className="verse-modal-colors">
          {Object.keys(colorsList).map((colorID) => (
            <div
              onClick={(event) => onClickColor(event, colorsList[colorID])}
              key={colorID}
              className={`verse-modal-colors-item text-center fs-4 mb-1 ${
                chosenColor?.colorID === colorID ? activeClassName : ""
              }`}
              style={{
                backgroundColor: colorsList[colorID].colorCode,
                color: getTextColor(colorsList[colorID].colorCode),
              }}
            >
              {colorsList[colorID].colorDisplay}
            </div>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-dismiss="modal"
          onClick={onClickSave}
        >
          Save changes
        </button>
      </ModalFooter>
    </ModalContainer>
  );
};

export default VerseModal;
