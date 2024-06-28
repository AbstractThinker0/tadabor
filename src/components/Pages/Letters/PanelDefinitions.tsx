import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/store";

import {
  fetchLettersDefinitions,
  fetchLettersPresets,
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
  const definitionsLoading = useAppSelector(
    (state) => state.lettersPage.definitionsLoading
  );

  const presetsLoading = useAppSelector(
    (state) => state.lettersPage.presetsLoading
  );

  const currentPreset = useAppSelector(
    (state) => state.lettersPage.currentPreset
  );

  const letterPresets = useAppSelector(
    (state) => state.lettersPage.letterPresets
  );

  const dispatch = useAppDispatch();

  const [currentLetter, setCurrentLetter] = useState("");

  const handleClickLetter = (letter: string) => {
    setCurrentLetter(letter);
  };

  const onChangePreset = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(lettersPageActions.setCurrentPreset(event.target.value));
  };

  useEffect(() => {
    dispatch(fetchLettersDefinitions());
    dispatch(fetchLettersPresets());
  }, []);

  if (definitionsLoading || presetsLoading) return <LoadingSpinner />;

  return (
    <div className="panel-def">
      <div className="panel-def-preset">
        <label htmlFor="presetSelect" className="form-label fw-bold fs-4">
          Preset:
        </label>
        <select
          id="presetSelect"
          className="form-select"
          aria-label="Select"
          value={currentPreset}
          onChange={onChangePreset}
        >
          <option value="-1">Default</option>
          {Object.keys(letterPresets).map((presetID) => (
            <option key={presetID} value={presetID}>
              {letterPresets[presetID]}
            </option>
          ))}
        </select>
        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#createPreset"
        >
          Create
        </button>
      </div>
      <div className="panel-def-letters">
        {arabicAlphabetDefault.map((letter) => (
          <div className="panel-def-letters-item" key={letter}>
            <ItemLetter
              letter={letter}
              currentPreset={currentPreset}
              handleClickLetter={handleClickLetter}
            />
          </div>
        ))}
      </div>
      <ModalCreatePreset />
      <ModalEditLetter
        currentLetter={currentLetter}
        currentPreset={currentPreset}
      />
    </div>
  );
};

interface ItemLetterProps {
  letter: string;
  currentPreset: string;
  handleClickLetter: (letter: string) => void;
}

const ItemLetter = ({
  letter,
  currentPreset,
  handleClickLetter,
}: ItemLetterProps) => {
  const defKey = currentPreset === "-1" ? letter : `${letter}:${currentPreset}`;

  const letterDef = useAppSelector(
    (state) => state.lettersPage.lettersDefinitions[defKey]
  ) || { name: "", definition: "" };

  const onClickEdit = (letter: string) => {
    handleClickLetter(letter);
  };

  return (
    <>
      <span className="panel-def-letters-item-letter">{letter}</span>
      <span className="panel-def-letters-item-def" dir={letterDef?.dir || ""}>
        {letterDef?.definition || ""}
      </span>{" "}
      <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#editLetter"
        onClick={() => onClickEdit(letter)}
      >
        Edit
      </button>
    </>
  );
};

const ModalCreatePreset = () => {
  const { t } = useTranslation();

  const [presetName, setPresetName] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useAppDispatch();

  const refModal = useRef<HTMLDivElement>(null);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPresetName(event.target.value);
  };

  const onClickSave = () => {
    const presetID = Date.now().toString();
    dispatch(lettersPageActions.setPreset({ presetID, presetName }));
    dbFuncs
      .saveLettersPreset(presetID, presetName)
      .then(function () {
        toast.success(t("save_success"));
      })
      .catch(function () {
        toast.error(t("save_failed"));
      });
  };

  useEffect(() => {
    if (!modalVisible) {
      setPresetName("");
    }
  }, [modalVisible]);

  useEffect(() => {
    const modelElement = refModal.current;
    if (modelElement === null) return;

    const onModalShow = () => {
      setModalVisible(true);
    };

    const onModalHidden = () => {
      setModalVisible(false);
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

  return (
    <ModalContainer identifier="createPreset" refModal={refModal}>
      <ModalHeader identifier="createPreset" title="Create a new preset" />
      <ModalBody>
        <div className="form-group">
          <label htmlFor="presetName" className="form-label">
            Preset name:
          </label>
          <input
            id="presetName"
            className="form-input"
            value={presetName}
            onChange={onChangeName}
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
          Save
        </button>
      </ModalFooter>
    </ModalContainer>
  );
};

interface ModalEditLetterProps {
  currentLetter: string;
  currentPreset: string;
}

const ModalEditLetter = ({
  currentLetter,
  currentPreset,
}: ModalEditLetterProps) => {
  const { t } = useTranslation();

  const defKey =
    currentPreset === "-1"
      ? currentLetter
      : `${currentLetter}:${currentPreset}`;

  const currentDef = useAppSelector(
    (state) => state.lettersPage.lettersDefinitions[defKey]
  ) || { name: "", definition: "", dir: "" };

  const [letterDef, setLetterDef] = useState(currentDef.definition);
  const [letterDir, setLetterDir] = useState(currentDef.dir || "rtl");

  const [modalVis, setModalVis] = useState(false);

  const dispatch = useAppDispatch();

  const refVerseModal = useRef<HTMLDivElement>(null);

  const onClickSave = () => {
    dbFuncs
      .saveLetterDefinition(currentPreset, currentLetter, letterDef, letterDir)
      .then(function () {
        toast.success(t("save_success"));
      })
      .catch(function () {
        toast.error(t("save_failed"));
      });

    dispatch(
      lettersPageActions.setLetterDefinition({
        name: currentLetter,
        definition: letterDef,
        dir: letterDir,
        preset_id: currentPreset,
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
