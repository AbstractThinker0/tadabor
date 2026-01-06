import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { useFetchNote, useSyncNotes, useUploadNote } from "@/services/backend";

import { useUserStore } from "@/store/zustand/userStore";

import { useCloudNotesStore } from "@/store/zustand/cloudNotes";
import { useLocalNotesStore } from "@/store/zustand/localNotes";
import type { CloudNoteProps } from "@/types";
import {
  buildNoteSyncPayload,
  fromBackendToDexie,
  fromDexieToBackend,
} from "@/util/notes";

import { useEffect, useEffectEvent, type PropsWithChildren } from "react";

const CloudNotesProvider = ({ children }: PropsWithChildren) => {
  const isLogged = useUserStore((state) => state.isLogged);
  const isLoggedOffline = useUserStore((state) => state.isLoggedOffline);
  const userId = useUserStore((state) => state.id);

  const isCloudNotesComplete = useCloudNotesStore((state) => state.complete);
  const isCloudNotesLoading = useCloudNotesStore((state) => state.loading);

  const fetchCloudNotes = useCloudNotesStore((state) => state.fetchCloudNotes);
  const cacheCloudNote = useCloudNotesStore((state) => state.cacheNote);
  const updateCloudSyncDate = useCloudNotesStore(
    (state) => state.updateSyncDate
  );

  const syncNotes = useSyncNotes();

  const uploadNoteMutation = useUploadNote();

  const onLoginEvent = useEffectEvent(() => {
    // Fetch cloud notes on login
    if (!userId) return;
    if (!isCloudNotesLoading && !isCloudNotesComplete) {
      fetchCloudNotes(userId);
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
    for (const noteID of noteIDs) {
      fetchNoteById(noteID)
        .then((result) => {
          const cloudNote = fromBackendToDexie(result.note);
          cacheCloudNote({ ...cloudNote, isNew: false });
        })
        .catch((error) => {
          console.error("Failed to fetch note:", noteID, error);
        });
    }
  };

  const uploadNotes = async (notesKeys: string[], isGuest: boolean = false) => {
    const localNotes = useLocalNotesStore.getState().data;
    const cloudNotes = useCloudNotesStore.getState().data;

    for (const noteID of notesKeys) {
      const note = isGuest ? localNotes[noteID] : cloudNotes[noteID];
      if (!note) {
        console.error(`Note with ID ${noteID} not found.`);
        continue;
      }

      const syncedNote: CloudNoteProps = {
        ...note,
        date_synced: 0,
        authorId: userId,
      };

      const uploadData = fromDexieToBackend(note);

      uploadNoteMutation
        .mutateAsync(uploadData)
        .then((result) => {
          if (result.success) {
            syncedNote.date_synced = result.note.dateLastSynced;
            if (isGuest) {
              cacheCloudNote({
                ...syncedNote,
                isNew: false,
              });
            } else {
              updateCloudSyncDate({
                name: note.id,
                value: syncedNote.date_synced,
              });
            }
          }
        })
        .catch((error) => {
          console.error("Upload mutation failed for note ID:", noteID, error);
        });
    }
  };

  const onCloudNotesLoaded = useEffectEvent(() => {
    if (isLogged && !isLoggedOffline && !syncNotes.isPending) {
      const localNotes = useLocalNotesStore.getState().data;
      const cloudNotes = useCloudNotesStore.getState().data;

      const cloudNotesIds = Object.keys(cloudNotes);
      const uniqueGuestNotes = Object.values(localNotes)
        .filter((note) => !cloudNotesIds.includes(note.id)) // This check skips notes that are already cloud notes expecting users to not have the same note in both local and cloud
        .map((note) => buildNoteSyncPayload(note, 0));

      // Prepare existing cloud notes
      const notesArray = Object.values(cloudNotes).map((note) =>
        buildNoteSyncPayload(note, note.date_synced ?? 0)
      );

      // Initiate sync
      syncNotes.mutate(
        {
          clientNotes: notesArray,
          guestNotes: uniqueGuestNotes,
        },
        {
          onSuccess(data) {
            // Fetch notes sent from server
            fetchNotes(data.notesToSendToClient);

            // Upload notes requested by server
            uploadNotes(data.notesToRequestFromClient);
            uploadNotes(data.notesToRequestFromGuest, true);
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
