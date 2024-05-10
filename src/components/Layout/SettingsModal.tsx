import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { settingsActions } from "@/store/slices/global/settings";

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/Generic/Modal";

import VerseContainer from "@/components/Custom/VerseContainer";
import { nfsDefault, nfsStored, qfsDefault, qfsStored } from "@/util/consts";

const SettingsModal = () => {
  const { i18n } = useTranslation();
  const resolvedLang = i18n.resolvedLanguage;

  const refSettingsModal = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const quranFS = useAppSelector((state) => state.settings.quranFontSize);
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const [orgQuranFS, setOrgQuranFS] = useState(quranFS);
  const [orgNotesFS, setOrgNotesFS] = useState(notesFS);
  const [orgLang, setOrgLang] = useState(resolvedLang);

  const onChangeLang = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const onChangeQFS = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(settingsActions.setQuranFS(Number(event.target.value)));
  };

  const onChangeNFS = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(settingsActions.setNotesFS(Number(event.target.value)));
  };

  const onClickSave = () => {
    setOrgQuranFS(quranFS);
    localStorage.setItem(qfsStored, String(quranFS));
    setOrgNotesFS(notesFS);
    localStorage.setItem(nfsStored, String(notesFS));
    setOrgLang(resolvedLang);
  };

  useEffect(() => {
    const modalElement = refSettingsModal.current;
    if (modalElement === null) return;

    const onModalHiden = () => {
      dispatch(settingsActions.setQuranFS(orgQuranFS));
      dispatch(settingsActions.setNotesFS(orgNotesFS));
      i18n.changeLanguage(orgLang);
    };

    modalElement.addEventListener("hidden.bs.modal", onModalHiden);

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", onModalHiden);
      }
    };
  }, [orgQuranFS, orgNotesFS, orgLang]);

  const onClickReset = () => {
    dispatch(settingsActions.setQuranFS(qfsDefault));
    dispatch(settingsActions.setNotesFS(nfsDefault));
    i18n.changeLanguage("ar");
  };

  return (
    <ModalContainer
      identifier="settingsModal"
      extraClass="settings-modal"
      dialogClass="modal-lg"
      refModal={refSettingsModal}
    >
      <ModalHeader identifier="settingsModal" title="Settings" />
      <ModalBody>
        <div>
          Language:{" "}
          <div
            className="btn-group"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio1"
              autoComplete="off"
              checked={resolvedLang === "en"}
              onChange={() => onChangeLang("en")}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio1">
              English
            </label>
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio2"
              autoComplete="off"
              checked={resolvedLang === "ar"}
              onChange={() => onChangeLang("ar")}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio2">
              العربية
            </label>
          </div>
        </div>
        <hr />
        <div>
          <label htmlFor="qfsRange" className="form-label">
            Quran Font Size:
          </label>
          <input
            type="range"
            className="form-range"
            value={quranFS}
            min="1"
            max="4"
            step="0.125"
            id="qfsRange"
            onChange={onChangeQFS}
          ></input>
        </div>
        <div className="text-center">
          <VerseContainer extraClass="settings-modal-verse">
            وَلَتَعْلَمُنَّ نَبَأَهُ بَعْدَ حِينٍ (ص:88)
          </VerseContainer>
        </div>
        <hr />
        <div>
          <label htmlFor="nfsRange" className="form-label">
            Notes Font Size:
          </label>
          <input
            type="range"
            className="form-range"
            value={notesFS}
            min="1"
            max="4"
            step="0.125"
            id="nfsRange"
            onChange={onChangeNFS}
          ></input>
        </div>
        <div className="text-center">
          <span
            className="settings-modal-verse"
            style={{ fontSize: `${notesFS}rem` }}
          >
            Note example - مثال كتابة
          </span>
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
        <button
          type="button"
          className="btn btn-warning"
          onClick={onClickReset}
        >
          Reset to defaults
        </button>
      </ModalFooter>
    </ModalContainer>
  );
};

export default SettingsModal;
