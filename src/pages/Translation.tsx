import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { isTransNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchTransNotes } from "@/store/slices/global/transNotes";
import { translationPageActions } from "@/store/slices/pages/translation";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import ChaptersList from "@/components/Custom/ChaptersList";
import DisplayPanel from "@/components/Pages/Translation/DisplayPanel";

import "@/styles/pages/translation.scss";

const Translation = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const isTNotesLoading = useAppSelector(isTransNotesLoading());
  const { currentChapter } = useAppSelector((state) => state.translationPage);

  useEffect(() => {
    dispatch(fetchTransNotes());
  }, []);

  const handleChapterChange = (chapter: number) => {
    dispatch(translationPageActions.setCurrentChapter(chapter));
  };

  return (
    <div className="translation">
      <div className="side border-start justify-content-center">
        <h4 className="side-chapters-title">{t("roots_list")}</h4>
        <ChaptersList
          handleChapterChange={handleChapterChange}
          selectChapter={currentChapter}
          mainClass="side-chapters"
          inputClass="side-chapters-input"
        />
      </div>
      {isTNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <DisplayPanel selectChapter={currentChapter} />
      )}
    </div>
  );
};

export default Translation;
