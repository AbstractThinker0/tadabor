import { useAppSelector, getNotesKeys } from "@/store";

export const useSavedNotes = () => {
  const isLogged = useAppSelector((state) => state.user.isLogged);

  const userNotes = useAppSelector((state) =>
    isLogged ? state.cloudNotes.data : state.localNotes.data
  );

  const userNotesIDs = useAppSelector(getNotesKeys(undefined, !isLogged));

  const getNotesIDsbyType = (type: "verse" | "root" | "translation") =>
    userNotesIDs.filter((id) => id.startsWith(type));

  return {
    userNotesIDs,
    userNotes,
    getNotesIDsbyType,
  };
};
