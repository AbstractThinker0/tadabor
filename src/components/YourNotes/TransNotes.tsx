import { useTranslation } from "react-i18next";

import { useAppSelector, getAllTransNotesKeys } from "@/store";
import TransComponent from "./TransComponent";

const TransNotes = () => {
  const notesKeys = useAppSelector(getAllTransNotesKeys);
  const { t } = useTranslation();

  return (
    <>
      {notesKeys.length ? (
        <>
          {notesKeys.map((key) => (
            <TransComponent verseKey={key} key={key} />
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

export default TransNotes;
