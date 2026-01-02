import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { useFetchNote, useSyncNotes, useUploadNote } from "@/services/backend";

import { useAppSelector } from "@/store";

import { useCloudNotesStore } from "@/store/zustand/cloudNotes";
import { useLocalNotesStore } from "@/store/zustand/localNotes";
import type { CloudNoteProps } from "@/types";
import {
  buildNoteSyncPayload,
  fromBackendToDexie,
  fromDexieToBackend,
} from "@/util/notes";
import { tryCatch } from "@/util/trycatch";

import { useEffect, useEffectEvent, type PropsWithChildren } from "react";

const CloudNotesProvider = ({ children }: PropsWithChildren) => {
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const isLoggedOffline = useAppSelector((state) => state.user.isLoggedOffline);
  const userId = useAppSelector((state) => state.user.id);

  const isCloudNotesComplete = useCloudNotesStore((state) => state.complete);
  const isCloudNotesLoading = useCloudNotesStore((state) => state.loading);

  const localNotes = useLocalNotesStore((state) => state.data);
  const cloudNotesIds = useCloudNotesStore((state) => state.dataKeys);
  const cloudNotes = useCloudNotesStore((state) => state.data);

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
    // Fetching notes from the cloud
    for (const noteID of noteIDs) {
      const { result, error } = await tryCatch(fetchNoteById(noteID));
      if (error) {
        console.error("Fetch failed", error);
      } else {
        const fetchedNote = result.note;

        const clNote = fromBackendToDexie(fetchedNote);

        cacheCloudNote({ ...clNote, isNew: false });
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
              cacheCloudNote({
                ...syncedNote,
                isNew: false,
              });
            } else {
              updateCloudSyncDate({
                name: clNote.id,
                value: syncedNote.date_synced,
              });
            }
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
