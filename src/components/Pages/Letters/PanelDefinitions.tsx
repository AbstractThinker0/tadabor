import { useEffect, useRef, useState, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/store";

import {
  fetchLettersDefinitions,
  lettersPageActions,
} from "@/store/slices/pages/letters";

import { dbFuncs } from "@/util/db";
import { arabicAlphabetDefault } from "@/util/consts";

import { TextAreaComponent } from "@/components/Custom/TextForm";
import TextareaToolbar from "@/components/Generic/TextareaToolbar";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import {
  ModalContainer,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/Generic/Modal";

const PanelDefinitions = () => {
  const lettersDefinitions = useAppSelector(
    (state) => state.lettersPage.lettersDefinitions
  );

  const definitionsLoading = useAppSelector(
    (state) => state.lettersPage.definitionsLoading
  );

  const dispatch = useAppDispatch();

  const [currentLetter, setCurrentLetter] = useState("");

  const onClickEdit = (letter: string) => {
    setCurrentLetter(letter);
  };

  useEffect(() => {
    dispatch(fetchLettersDefinitions());
  }, []);

  if (definitionsLoading) return <LoadingSpinner />;

  return (
    <div className="panel-def">
      <div className="panel-def-letters">
        {arabicAlphabetDefault.map((letter) => (
          <div className="panel-def-letters-item" key={letter}>
            <span className="panel-def-letters-item-letter">{letter}</span>
            <span
              className="panel-def-letters-item-def"
              dir={lettersDefinitions[letter]?.dir || ""}
            >
              {lettersDefinitions[letter]?.definition || ""}
            </span>{" "}
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#editLetter"
              onClick={() => onClickEdit(letter)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
      <ModalEditLetter currentLetter={currentLetter} />
    </div>
  );
};

interface ModalEditLetterProps {
  currentLetter: string;
}

const ModalEditLetter = ({ currentLetter }: ModalEditLetterProps) => {
  const currentDef = useAppSelector(
    (state) => state.lettersPage.lettersDefinitions[currentLetter]
  ) || { definition: "", dir: "" };

  const [letterDef, setLetterDef] = useState(currentDef.definition);
  const [letterDir, setLetterDir] = useState(currentDef.dir || "rtl");

  const [modalVis, setModalVis] = useState(false);

  const dispatch = useAppDispatch();

  const refVerseModal = useRef<HTMLDivElement>(null);

  const onClickSave = () => {
    dbFuncs.saveLetterDefinition(
      currentLetter,
      "-1",
      currentLetter,
      letterDef,
      letterDir
    );

    dispatch(
      lettersPageActions.setLetterDefinition({
        letter: currentLetter,
        definition: letterDef,
        dir: letterDir,
        preset_id: "-1",
      })
    );
  };

  useEffect(() => {
    if (modalVis) {
      setLetterDef(currentDef.definition);
      setLetterDir(currentDef.dir || "rtl");
    } else {
      setLetterDef("");
      setLetterDir("");
    }
  }, [modalVis]);

  useEffect(() => {
    const modelElement = refVerseModal.current;
    if (modelElement === null) return;

    const onModalShow = () => {
      setModalVis(true);
    };

    const onModalHidden = () => {
      setModalVis(false);
    };

    modelElement.addEventListener("show.bs.modal", onModalShow);
    modelElement.addEventListener("hidden.bs.modal", onModalHidden);

    return () => {
      if (modelElement) {
        modelElement.removeEventListener("show.bs.modal", onModalShow);
        modelElement.removeEventListener("hidden.bs.modal", onModalHidden);
      }
    };
  }, []);

  const handleSetDirection = useCallback(
    (inputKey: string, dir: string) => {
      //
      setLetterDir(dir);
    },
    [setLetterDir]
  );

  const handleInputChange = useCallback(
    (name: string, value: string) => {
      setLetterDef(value);
    },
    [setLetterDef]
  );

  return (
    <ModalContainer identifier="editLetter" refModal={refVerseModal}>
      <ModalHeader
        identifier="editLetter"
        title={`Edit definition of:  ${currentLetter}`}
      />
      <ModalBody>
        <div className="form-group">
          <TextareaToolbar
            inputKey={currentLetter}
            handleSetDirection={handleSetDirection}
          />
          <TextAreaComponent
            inputKey={currentLetter}
            inputValue={letterDef}
            inputDirection={letterDir}
            handleInputChange={handleInputChange}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Cancel
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

export default PanelDefinitions;
