import { useTranslation } from "react-i18next";

import { getAllNotesKeys, useAppSelector } from "@/store";
import VerseComponent from "./VerseComponent";

const VerseNotes = () => {
  const myNotes = useAppSelector(getAllNotesKeys);
  const { t } = useTranslation();

  return (
    <>
      {myNotes.length ? (
        <>
          {myNotes.map((key) => (
            <VerseComponent verseKey={key} key={key} />
          ))}
        </>
      ) : (
        <div className="fs-4 text-center">
          <div>{t("no_notes")}</div>
        </div>
      )}
    </>
  );
};

export default VerseNotes;
