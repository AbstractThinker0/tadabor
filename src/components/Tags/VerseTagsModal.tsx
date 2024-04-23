import { useEffect, useRef, useState } from "react";

import useQuran from "@/context/useQuran";
import { verseProps } from "@/types";

import { tagsProps } from "./consts";

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/Generic/Modal";

interface VerseTagModalProps {
  tags: tagsProps;
  currentVerse: verseProps | null;
  verseTags: string[] | null;
  setCurrentVerse: (verse: verseProps | null) => void;
  setVerseTags: (verseKey: string, verseTags: string[] | null) => void;
}

function VerseTagsModal({
  tags,
  currentVerse,
  verseTags,
  setCurrentVerse,
  setVerseTags,
}: VerseTagModalProps) {
  const quranService = useQuran();
  const refVerseModal = useRef<HTMLDivElement>(null);

  const [chosenTags, setChosenTags] = useState(() =>
    verseTags === null ? [] : verseTags
  );

  useEffect(() => {
    setChosenTags(verseTags ? verseTags : []);
  }, [verseTags]);

  useEffect(() => {
    const modelElement = refVerseModal.current;
    if (modelElement === null) return;

    function onModalHide() {
      setChosenTags([]);
      setCurrentVerse(null);
    }

    modelElement.addEventListener("hide.bs.modal", onModalHide);

    return () => {
      if (modelElement) {
        modelElement.removeEventListener("hide.bs.modal", onModalHide);
      }
    };
  }, [setCurrentVerse]);

  const canFindTag = (tagID: string) => {
    return chosenTags.includes(tagID);
  };

  function onClickTag(tagID: string) {
    if (!currentVerse) return;

    let newTags: string[] = [];

    if (canFindTag(tagID)) {
      newTags = chosenTags.filter((nTag) => {
        return nTag !== tagID;
      });
    } else {
      newTags = [...chosenTags, tagID];
    }

    setChosenTags(newTags);
  }

  function onClickSave() {
    if (currentVerse?.key) setVerseTags(currentVerse.key, chosenTags);
  }

  return (
    <ModalContainer
      identifier="verseTagsModal"
      extraClass="modal-versetags"
      dialogClass="modal-lg"
      refModal={refVerseModal}
    >
      <ModalHeader identifier="verseTagsModal" title="Choose verse tags" />
      <ModalBody>
        <div className="modal-versetags-title text-center fs-4">
          (
          {currentVerse
            ? quranService.getChapterName(currentVerse.suraid) +
              ":" +
              currentVerse.verseid
            : ""}
          )
        </div>
        <div className="modal-versetags-text text-center rounded fs-4">
          {currentVerse?.versetext}
        </div>
        <div className="modal-versetags-items">
          {Object.keys(tags).map((tagID) => (
            <div
              onClick={() => onClickTag(tagID)}
              className={`modal-versetags-items-item text-center fs-4 mb-1 ${
                canFindTag(tagID) ? "modal-versetags-items-item-selected" : ""
              }`}
              key={tagID}
            >
              {tags[tagID].tagDisplay}
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
}

export default VerseTagsModal;
