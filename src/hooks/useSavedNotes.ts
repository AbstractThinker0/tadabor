import { useNotesStore } from "@/hooks/useNotesStore";

export const useSavedNotes = () => {
  const { data: userNotes, dataKeys: userNotesIDs } = useNotesStore();

  const getNotesIDsbyType = (type: "verse" | "root" | "translation") =>
    userNotesIDs.filter((id) => id.startsWith(type));

  return {
    userNotesIDs,
    userNotes,
    getNotesIDsbyType,
  };
};
