import { useSingleNote } from "@/hooks/useSingleNote";
import { useNoteSave } from "@/hooks/useNoteSave";
import { useUserStore } from "@/store/global/userStore";

import { createNewNote } from "@/util/notes";
import {
  getDefaultNoteDirection,
  isNoteType,
  resolveNoteIdentity,
  type NoteType,
} from "@/util/noteIdentity";
import type { CloudNoteProps } from "@/types/notes";

interface useNoteParams {
  noteId?: string;
  noteType?: NoteType;
  noteKey?: string;
}

export const useNote = ({ noteId, noteType, noteKey }: useNoteParams) => {
  const userId = useUserStore((state) => state.id);
  const identity = resolveNoteIdentity({ noteId, noteType, noteKey });
  const noteIndex = identity.id;

  const {
    note,
    isNoteLoading,
    cacheNote,
    changeNote,
    changeNoteDir,
  } = useSingleNote(noteIndex);

  const noteText = note?.text ?? "";
  const notePreSaveText = note?.preSave ?? "";
  const notePreSaveDirection = note?.preSaveDir ?? "";
  const noteSaved = note?.saved ?? false;
  const noteValidKey = note?.key ?? identity.key;
  const noteValidType =
    note?.type && isNoteType(note.type) ? note.type : identity.type;
  const noteDirection = note?.dir ?? getDefaultNoteDirection(noteValidType);
  const { save, isSaving } = useNoteSave({
    noteId: noteIndex,
    note,
    noteType: noteValidType,
    noteDirection,
  });
  const noteIsSynced = (note as CloudNoteProps)?.isSynced || false;
  const noteIsSyncing = isSaving;
  const noteSyncDate = (note as CloudNoteProps)?.date_synced ?? 0;
  const noteModifiedDate = note?.date_modified ?? 0;
  const isOutOfSync = noteSyncDate < noteModifiedDate;

  const setText = (text: string) => {
    if (!note) {
      const newNote = createNewNote({
        id: noteIndex,
        text,
        dir: noteDirection,
        authorId: userId ? userId : undefined,
      });

      cacheNote(newNote);
    } else {
      changeNote({ name: noteIndex, value: text });
    }
  };

  const setDirection = (dir: string) => {
    if (!note) {
      const newNote = createNewNote({
        id: noteIndex,
        dir,
        authorId: userId ? userId : undefined,
      });

      cacheNote(newNote);
    } else {
      changeNoteDir({ name: noteIndex, value: dir });
    }
  };

  // For now we don't use this since we bulk fetch notes on login ( might be needed again later for multi tabs usage )
  /*
  const fetchNoteIfNeeded = useEffectEvent(() => {
    fetchSingleNoteIfNeeded();
  });

  useEffect(() => {
    if (!isVisible) return;

    fetchNoteIfNeeded();
  }, [isVisible, isLogged]);
  */

  return {
    id: noteIndex,
    preSaveText: notePreSaveText,
    preSaveDirection: notePreSaveDirection,
    text: noteText,
    direction: noteDirection,
    isSaved: noteSaved,
    type: noteValidType,
    key: noteValidKey,
    isLoading: isNoteLoading,
    isSynced: noteIsSynced,
    isSyncing: noteIsSyncing,
    isOutOfSync,
    dateCreated: note?.date_created,
    dateModified: note?.date_modified,
    setText,
    setDirection,
    save,
  };
};
