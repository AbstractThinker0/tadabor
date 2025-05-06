import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { useTRPC } from "@/util/trpc";
import { useMutation } from "@tanstack/react-query";
import { CloudNoteProps } from "@/types";
import { cloudNotesActions } from "@/store/slices/global/cloudNotes";
import { dbFuncs } from "@/util/db";

interface NotesProviderProps {
  children: React.ReactNode;
}

const NotesProvider = ({ children }: NotesProviderProps) => {
  const isLogged = useAppSelector((state) => state.user.isLogged);

  const hasLoadedLocalNotes = useAppSelector(
    (state) => state.localNotes.complete
  );
  const hasLoadedCloudNotes = useAppSelector(
    (state) => state.cloudNotes.complete
  );

  const localNotes = useAppSelector((state) => state.localNotes.data);
  const cloudNotesIds = useAppSelector((state) => state.cloudNotes.dataKeys);
  const cloudNotes = useAppSelector((state) => state.cloudNotes.data);

  const dispatch = useAppDispatch();

  const trpc = useTRPC();

  const syncNotes = useMutation(trpc.notes.syncNotes.mutationOptions());
  const uploadNote = useMutation(trpc.notes.uploadNote.mutationOptions());

  useEffect(() => {
    if (
      isLogged &&
      hasLoadedCloudNotes &&
      hasLoadedLocalNotes &&
      !syncNotes.isPending
    ) {
      const uniqueGuestNotes = Object.values(localNotes)
        .filter((note) => !cloudNotesIds.includes(note.id))
        .map((note) => ({
          id: note.id,
          uuid: note.uuid,
          key: note.key,
          type: note.type,
          dateModified: note.date_modified!,
          dateLastSynced: 0,
        }));

      const notesArray = Object.values(cloudNotes).map((note) => ({
        id: note.id,
        uuid: note.uuid,
        key: note.key,
        type: note.type,
        dateModified: note.date_modified!,
        dateLastSynced: note.date_synced!,
      }));

      syncNotes.mutateAsync({
        clientNotes: notesArray,
        guestNotes: uniqueGuestNotes,
      });
    }
  }, [isLogged, hasLoadedCloudNotes, hasLoadedLocalNotes]);

  const uploadNotes = async (notesKeys: string[], guest: boolean = false) => {
    // Uploading notes to the cloud
    for (const noteID of notesKeys) {
      const clNote = guest
        ? { ...localNotes[noteID] }
        : { ...cloudNotes[noteID] };

      if (!clNote) continue;

      try {
        const uploadData = {
          key: clNote.key,
          type: clNote.type,
          uuid: clNote.uuid,
          content: clNote.text,
          dateCreated: clNote.date_created!,
          dateModified: clNote.date_modified!,
          direction: clNote.dir!,
        };

        const result = await uploadNote.mutateAsync(uploadData);

        if (result?.success) {
          dispatch(
            cloudNotesActions.updateSyncDate({
              name: clNote.id!,
              value: result?.note.dateLastSynced,
            })
          );

          try {
            await dbFuncs.saveCloudNote(clNote);
          } catch (error) {
            console.error("error:", error);
          }
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  useEffect(() => {
    if (syncNotes.isSuccess) {
      const serverNotes = syncNotes.data.notesToSendToClient;

      for (const fetchedNote of serverNotes) {
        const clNote: CloudNoteProps = {
          id: fetchedNote.id,
          authorId: fetchedNote.authorId,
          key: fetchedNote.key,
          text: fetchedNote.content!,
          type: fetchedNote.type,
          uuid: fetchedNote.uuid,
          dir: fetchedNote.direction!,
          date_created: fetchedNote.dateCreated,
          date_modified: fetchedNote.dateModified,
          date_synced: fetchedNote.dateLastSynced,
        };

        dispatch(cloudNotesActions.cacheNote(clNote));
        dbFuncs.saveCloudNote(clNote);
      }

      const clientNotesKeys = syncNotes.data.notesToRequestFromClient;
      const guestNotesKeys = syncNotes.data.notesToRequestFromGuest;

      uploadNotes(clientNotesKeys);
      uploadNotes(guestNotesKeys, true);
    }
  }, [syncNotes.isSuccess]);

  useEffect(() => {
    if (!isLogged && syncNotes.isPending) {
      // cancel mutation on logout ?
      syncNotes.reset();
    }
  }, [isLogged]);

  return <>{children}</>;
};

export default NotesProvider;
