import { useEffect, useRef, useState } from "react";

import { useAppDispatch } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

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
  verseColor: colorProps | null;
}

const VerseModal = ({
  colorsList,
  currentVerse,
  setVerseColor,
  verseColor,
}: VerseModalProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();
  const refVerseModal = useRef<HTMLDivElement>(null);

  const [chosenColor, setChosenColor] = useState(verseColor);

  useEffect(() => {
    setChosenColor(verseColor);
  }, [verseColor]);

  useEffect(() => {
    const modelElement = refVerseModal.current;
    if (modelElement === null) return;

    function onModalHidden() {
      setChosenColor(null);
      dispatch(coloringPageActions.setCurrentVerse(null));
    }

    modelElement.addEventListener("hidden.bs.modal", onModalHidden);

    return () => {
      if (modelElement) {
        modelElement.removeEventListener("hidden.bs.modal", onModalHidden);
      }
    };
  }, []);

  function onClickSave() {
    if (currentVerse?.key) {
      setVerseColor(currentVerse.key, chosenColor);
    }
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
