import { useTranslation } from "react-i18next";

import { getAllRootNotesKeys, useAppSelector } from "@/store";

import RootComponent from "./RootComponent";

const RootNotes = () => {
  const myNotes = useAppSelector(getAllRootNotesKeys);
  const { t } = useTranslation();

  return (
    <>
      {myNotes.length ? (
        <>
          {myNotes.map((key) => (
            <RootComponent rootID={key} key={key} />
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

export default RootNotes;
