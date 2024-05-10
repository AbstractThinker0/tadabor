import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { isTransNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchTransNotes } from "@/store/slices/global/transNotes";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import ChaptersList from "@/components/Custom/ChaptersList";
import DisplayPanel from "@/components/Translation/DisplayPanel";

const Translation = () => {
  const [selectChapter, setSelectChapter] = useState(1);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const isTNotesLoading = useAppSelector(isTransNotesLoading());

  useEffect(() => {
    dispatch(fetchTransNotes());
  }, []);

  const handleChapterChange = (chapter: number) => {
    setSelectChapter(chapter);
  };

  return (
    <div className="translation">
      <div className="side border-start justify-content-center">
        <h4 className="side-chapters-title">{t("roots_list")}</h4>
        <ChaptersList
          handleChapterChange={handleChapterChange}
          selectChapter={selectChapter}
          mainClass="side-chapters"
          inputClass="side-chapters-input"
        />
      </div>
      {isTNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <DisplayPanel selectChapter={selectChapter} />
      )}
    </div>
  );
};

export default Translation;
