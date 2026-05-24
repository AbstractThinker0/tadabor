import { useEffect, useEffectEvent } from "react";

import { useFetchNote, useSyncNotes, useUploadNote } from "@/services/backend";
import { useCloudNotesStore } from "@/store/global/cloudNotes";
import { useLocalNotesStore } from "@/store/global/localNotes";
import { useUserStore } from "@/store/global/userStore";
import type { CloudNoteProps } from "@/types";
import {
  buildNoteSyncPayload,
  fromBackendToDexie,
  fromDexieToBackend,
} from "@/util/notes";

export const useCloudNotesSync = () => {
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

      uploadNoteMutation
        .mutateAsync(fromDexieToBackend(note))
        .then((result) => {
          if (!result.success) {
            return;
          }

          syncedNote.date_synced = result.note.dateLastSynced;

          if (isGuest) {
            cacheCloudNote({
              ...syncedNote,
              isNew: false,
            });
            return;
          }

          updateCloudSyncDate({
            name: note.id,
            value: syncedNote.date_synced,
          });
        })
        .catch((error) => {
          console.error("Upload mutation failed for note ID:", noteID, error);
        });
    }
  };

  const hydrateCloudNotesOnLogin = useEffectEvent(() => {
    if (!userId) {
      return;
    }

    if (!isCloudNotesLoading && !isCloudNotesComplete) {
      fetchCloudNotes(userId);
    }
  });

  const resetPendingSyncOnLogout = useEffectEvent(() => {
    if (syncNotes.isPending) {
      syncNotes.reset();
    }
  });

  const syncLoadedCloudNotes = useEffectEvent(() => {
    if (!isLogged || isLoggedOffline || syncNotes.isPending) {
      return;
    }

    const localNotes = useLocalNotesStore.getState().data;
    const cloudNotes = useCloudNotesStore.getState().data;

    const cloudNotesIds = Object.keys(cloudNotes);
    const uniqueGuestNotes = Object.values(localNotes)
      .filter((note) => !cloudNotesIds.includes(note.id))
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
          fetchNotes(data.notesToSendToClient);
          uploadNotes(data.notesToRequestFromClient);
          uploadNotes(data.notesToRequestFromGuest, true);
        },
        onError(error) {
          console.error("Error during notes synchronization:", error);
        },
      }
    );
  });

  useEffect(() => {
    if (isLogged) {
      hydrateCloudNotesOnLogin();
      return;
    }

    resetPendingSyncOnLogout();
  }, [isLogged]);

  useEffect(() => {
    if (isCloudNotesComplete) {
      syncLoadedCloudNotes();
    }
  }, [isCloudNotesComplete]);

  return {
    isLogged,
    isCloudNotesReady: !isLogged || isCloudNotesComplete,
  };
};