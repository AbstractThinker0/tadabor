import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { useFetchNote, useSyncNotes, useUploadNote } from "@/services/backend";

import { useAppDispatch, useAppSelector } from "@/store";
import {
  cloudNotesActions,
  fetchCloudNotes,
} from "@/store/slices/global/cloudNotes";
import type { CloudNoteProps } from "@/types";
import { dbFuncs } from "@/util/db";
import {
  buildNoteSyncPayload,
  fromBackendToDexie,
  fromDexieToBackend,
  fromReduxToDexie,
} from "@/util/notes";

import { useEffect, useEffectEvent, type PropsWithChildren } from "react";

const CloudNotesProvider = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();

  const isLogged = useAppSelector((state) => state.user.isLogged);
  const isLoggedOffline = useAppSelector((state) => state.user.isLoggedOffline);
  const userId = useAppSelector((state) => state.user.id);

  const isCloudNotesComplete = useAppSelector(
    (state) => state.cloudNotes.complete
  );

  const isCloudNotesLoading = useAppSelector(
    (state) => state.cloudNotes.loading
  );

  const localNotes = useAppSelector((state) => state.localNotes.data);
  const cloudNotesIds = useAppSelector((state) => state.cloudNotes.dataKeys);
  const cloudNotes = useAppSelector((state) => state.cloudNotes.data);

  const syncNotes = useSyncNotes();

  const uploadNoteMutation = useUploadNote();

  const onLoginEvent = useEffectEvent(() => {
    // Fetch cloud notes on login
    if (!isCloudNotesLoading && !isCloudNotesComplete) {
      dispatch(fetchCloudNotes({ userId }));
    }
  });

  const onLogoutEvent = useEffectEvent(() => {
    // cancel mutation on logout ?
    if (syncNotes.isPending) {
      syncNotes.reset();
    }
  });

  useEffect(() => {
    if (isLogged) {
      onLoginEvent();
    } else {
      onLogoutEvent();
    }
  }, [isLogged]);

  const fetchNoteById = useFetchNote();

  const fetchNotes = async (noteIDs: string[]) => {
    // Fetching notes from the cloud
    for (const noteID of noteIDs) {
      try {
        const fetchedNote = (await fetchNoteById(noteID)).note;

        const clNote = fromBackendToDexie(fetchedNote);

        dispatch(cloudNotesActions.cacheNote({ ...clNote, isNew: false }));
        dbFuncs.saveCloudNote(clNote);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    }
  };

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

      const syncedNote: CloudNoteProps = {
        ...clNote,
        date_synced: 0,
        authorId: userId,
      };

      const uploadData = fromDexieToBackend(clNote);

      uploadNoteMutation
        .mutateAsync(uploadData)
        .then((result) => {
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

            dbFuncs
              .saveCloudNote(fromReduxToDexie(syncedNote))
              .catch((error) => {
                console.error("Error saving note to local database:", error);
              });
          }
        })
        .catch((err) => {
          console.error("Upload failed for note ID:", noteID, err);
        });
    }
  };

  const onCloudNotesLoaded = useEffectEvent(() => {
    if (isLogged && !isLoggedOffline && !syncNotes.isPending) {
      const uniqueGuestNotes = Object.values(localNotes)
        .filter((note) => !cloudNotesIds.includes(note.id)) // This check skips notes that are already cloud notes expecting users to not have the same note in both local and cloud
        .map((note) => buildNoteSyncPayload(note, 0));

      const notesArray = Object.values(cloudNotes).map((note) =>
        buildNoteSyncPayload(note, note.date_synced ?? 0)
      );

      syncNotes.mutate(
        {
          clientNotes: notesArray,
          guestNotes: uniqueGuestNotes,
        },
        {
          onSuccess(data) {
            const serverNotes = data.notesToSendToClient;
            fetchNotes(serverNotes);

            const clientNotesKeys = data.notesToRequestFromClient;
            const guestNotesKeys = data.notesToRequestFromGuest;

            uploadNotes(clientNotesKeys);
            uploadNotes(guestNotesKeys, true);
          },
          onError(error) {
            console.error("Error during notes synchronization:", error);
          },
        }
      );
    }
  });

  useEffect(() => {
    if (isCloudNotesComplete) {
      // Cloud notes have finished loading
      onCloudNotesLoaded();
    }
  }, [isCloudNotesComplete]);

  if (isLogged && !isCloudNotesComplete) {
    return <LoadingSpinner text="Loading cloud notes.." />;
  }

  return <>{children}</>;
};

export default CloudNotesProvider;
