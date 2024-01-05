import { useEffect, useRef, useState } from "react";

import useQuran from "@/context/useQuran";
import { verseProps } from "@/types";

import { tagsProps } from "./consts";

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
    <div
      ref={refVerseModal}
      className="modal-versetags modal fade"
      id="verseTagsModal"
      tabIndex={-1}
      aria-labelledby="verseTagsModalLabel"
      aria-hidden="true"
      dir="ltr"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="verseTagsModalLabel">
              Choose verse tags
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
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
                    canFindTag(tagID)
                      ? "modal-versetags-items-item-selected"
                      : ""
                  }`}
                  key={tagID}
                >
                  {tags[tagID].tagDisplay}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer justify-content-center">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerseTagsModal;
