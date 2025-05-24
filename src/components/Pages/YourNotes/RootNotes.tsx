import { useTranslation } from "react-i18next";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import RootComponent from "@/components/Pages/YourNotes/RootComponent";
import BackupComponent from "@/components/Pages/YourNotes/BackupComponent";

import { Box, VStack } from "@chakra-ui/react";
import { useRootsLoaded } from "@/hooks/useRootsLoaded";
import { useSavedNotes } from "@/hooks/useSavedNote";

const RootNotes = () => {
  const rootsLoaded = useRootsLoaded();

  if (!rootsLoaded) return <LoadingSpinner text="Loading roots data.." />;

  return <NotesList />;
};

const NotesList = () => {
  const { t } = useTranslation();

  const { getNotesIDsbyType } = useSavedNotes();
  const rootNotesIDs = getNotesIDsbyType("root");

  return (
    <>
      {rootNotesIDs.length ? (
        <>
          <BackupComponent noteType="root" />
          <VStack gap={"2rem"} px={"1rem"} mdDown={{ px: "0.2rem" }}>
            {rootNotesIDs.map((noteID) => (
              <RootComponent noteID={noteID} key={noteID} />
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

export default RootNotes;
