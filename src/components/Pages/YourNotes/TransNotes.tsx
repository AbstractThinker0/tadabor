import { useTranslation } from "react-i18next";

import NoteComponent from "@/components/Pages/YourNotes/NoteComponent";
import BackupComponent from "@/components/Pages/YourNotes/BackupComponent";

import { Box, VStack } from "@chakra-ui/react";
import { useSavedNotes } from "@/hooks/useSavedNotes";

const TransNotes = () => {
  const { t } = useTranslation();

  const { getNotesIDsbyType } = useSavedNotes();
  const translationNotesIDs = getNotesIDsbyType("translation");

  return (
    <>
      {translationNotesIDs.length ? (
        <>
          <BackupComponent noteType="translation" />
          <VStack gap={"2rem"} px={"1rem"} mdDown={{ px: "0.2rem" }}>
            {translationNotesIDs.map((noteID) => (
              <NoteComponent noteID={noteID} key={noteID} />
            ))}
          </VStack>
        </>
      ) : (
        <Box textAlign={"center"} fontSize={"larger"}>
          {t("no_notes")}
        </Box>
      )}
    </>
  );
};

export default TransNotes;
