import { useCallback, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { useTRPC, useTRPCClient } from "@/util/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CloudNoteProps } from "@/types";
import { cloudNotesActions } from "@/store/slices/global/cloudNotes";
import { dbFuncs, type ICloudNote } from "@/util/db";
import {
  fromBackendToDexie,
  fromDexieToBackend,
  fromReduxToDexie,
  buildNoteSyncPayload,
} from "@/util/notes";

import { useBeforeUnload } from "react-router";

interface NotesProviderProps {
  children: React.ReactNode;
}

const NotesProvider = ({ children }: NotesProviderProps) => {
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const isLoggedOffline = useAppSelector((state) => state.user.isLoggedOffline);
  const userId = useAppSelector((state) => state.user.id);

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

  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  const hasUnsavedNotes = useCallback(() => {
    let hasUnsavedNotes = false;

    if (isLogged && cloudNotes) {
      hasUnsavedNotes = Object.values(cloudNotes).some(
        (note) => note.saved === false && (note.preSave || note.text)
      );
    } else if (localNotes) {
      hasUnsavedNotes = Object.values(localNotes).some(
        (note) => note.saved === false && (note.preSave || note.text)
      );
    }

    return hasUnsavedNotes;
  }, [isLogged, cloudNotes, localNotes]);

  useBeforeUnload((e) => {
    if (hasUnsavedNotes()) {
      e.preventDefault();
      e.returnValue = "You have unsaved notes..";
    }
  });

  const fetchNoteById = async ({ noteID }: { noteID: string }) => {
    return await queryClient.fetchQuery({
      queryKey: ["notes.fetchNote", { noteID }],
      queryFn: () => trpcClient.notes.fetchNote.query({ id: noteID }),
    });
  };

  const fetchNotes = async (noteIDs: string[]) => {
    // Fetching notes from the cloud
    for (const noteID of noteIDs) {
      try {
        const fetchedNote = (await fetchNoteById({ noteID })).note;

        const clNote: ICloudNote = fromBackendToDexie(fetchedNote);

        dispatch(cloudNotesActions.cacheNote({ ...clNote, isNew: false }));
        dbFuncs.saveCloudNote(clNote);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    }
  };

  useEffect(() => {
    if (
      isLogged &&
      !isLoggedOffline &&
      hasLoadedCloudNotes &&
      hasLoadedLocalNotes &&
      !syncNotes.isPending
    ) {
      const uniqueGuestNotes = Object.values(localNotes)
        .filter((note) => !cloudNotesIds.includes(note.id))
        .map((note) => buildNoteSyncPayload(note, 0));

      const notesArray = Object.values(cloudNotes).map((note) =>
        buildNoteSyncPayload(note, note.date_synced!)
      );

      syncNotes.mutateAsync({
        clientNotes: notesArray,
        guestNotes: uniqueGuestNotes,
      });
    }
  }, [isLogged, isLoggedOffline, hasLoadedCloudNotes, hasLoadedLocalNotes]);

  const uploadNotes = async (notesKeys: string[], guest: boolean = false) => {
    // Uploading notes to the cloud
    for (const noteID of notesKeys) {
      const clNote = guest
        ? { ...localNotes[noteID] }
        : { ...cloudNotes[noteID] };

      if (!clNote) {
        console.error(`Note with ID ${noteID} not found.`);
        continue;
      }

      try {
        const uploadData = fromDexieToBackend(clNote);

        const result = await uploadNote.mutateAsync(uploadData);

        const syncedNote: CloudNoteProps = {
          ...clNote,
          date_synced: 0,
          authorId: userId,
        };

        if (result && result.success) {
          syncedNote.date_synced = result.note.dateLastSynced;
          // if a guest note we need to cache it to cloud notes first
          if (guest) {
            dispatch(
              cloudNotesActions.cacheNote({
                ...syncedNote,
                isNew: false,
              })
            );
          } else {
            dispatch(
              cloudNotesActions.updateSyncDate({
                name: clNote.id!,
                value: syncedNote.date_synced,
              })
            );
          }

          try {
            await dbFuncs.saveCloudNote(fromReduxToDexie(syncedNote));
          } catch (error) {
            console.error("Error saving note to local database:", error);
          }
        }
      } catch (err) {
        console.error("Upload failed for note ID:", noteID, err);
      }
    }
  };

  useEffect(() => {
    if (syncNotes.isSuccess) {
      const serverNotes = syncNotes.data.notesToSendToClient;

      fetchNotes(serverNotes);

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
