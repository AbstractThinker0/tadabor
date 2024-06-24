import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { dbFuncs } from "@/util/db";

import useQuran from "@/context/useQuran";

import { colorProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/Generic/Modal";

const activeClassName = "verse-modal-colors-item-active";

const VerseModal = () => {
  const currentVerse = useAppSelector(
    (state) => state.coloringPage.currentVerse
  );
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );
  const colorsList = useAppSelector((state) => state.coloringPage.colorsList);

  const dispatch = useAppDispatch();
  const quranService = useQuran();
  const refVerseModal = useRef<HTMLDivElement>(null);

  const currentVerseKey = currentVerse?.key;

  const [chosenColor, setChosenColor] = useState(
    currentVerseKey && coloredVerses[currentVerseKey]
      ? coloredVerses[currentVerseKey]
      : null
  );

  useEffect(() => {
    if (!currentVerseKey) {
      setChosenColor(null);
      return;
    }

    if (!coloredVerses[currentVerseKey]) {
      setChosenColor(null);
      return;
    }

    setChosenColor(coloredVerses[currentVerseKey]);
  }, [currentVerse]);

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

  function setVerseColor(verseKey: string, color: colorProps | null) {
    if (color === null) {
      dbFuncs.deleteVerseColor(verseKey);
    } else {
      dbFuncs.saveVerseColor({
        verse_key: verseKey,
        color_id: color.colorID,
      });
    }

    dispatch(
      coloringPageActions.setVerseColor({
        verseKey: verseKey,
        color: color,
      })
    );
  }

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
            ? `${quranService.getChapterName(currentVerse.suraid)}:${
                currentVerse.verseid
              }`
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
