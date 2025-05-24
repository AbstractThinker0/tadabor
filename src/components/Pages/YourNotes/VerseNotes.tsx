import { useTranslation } from "react-i18next";

import VerseComponent from "@/components/Pages/YourNotes/VerseComponent";
import BackupComponent from "@/components/Pages/YourNotes/BackupComponent";

import { Box, VStack } from "@chakra-ui/react";
import { useSavedNotes } from "@/hooks/useSavedNote";

const VerseNotes = () => {
  const { t } = useTranslation();

  const { getNotesIDsbyType } = useSavedNotes();
  const verseNotesIDs = getNotesIDsbyType("verse");

  return (
    <>
      {verseNotesIDs.length ? (
        <>
          <BackupComponent noteType="verse" />
          <VStack gap={"2rem"} px={"1rem"} mdDown={{ px: "0.2rem" }}>
            {verseNotesIDs.map((noteID) => (
              <VerseComponent noteID={noteID} key={noteID} />
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

export default VerseNotes;
