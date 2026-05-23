import type { CloudNoteProps, LocalNoteProps } from "@/types";
import type { ICloudNote, ILocalNote } from "@/util/db";
import { dbNoteRevisions } from "@/util/dbFuncs";
import type { NoteType } from "@/util/noteIdentity";
import { computeDateModified, createNoteRevision } from "@/util/notes";
import { tryCatch } from "@/util/trycatch";

interface BuildSaveDataParams {
  noteId: string;
  note: LocalNoteProps | CloudNoteProps;
  noteType: NoteType;
  noteDirection: string;
}

const buildBaseSaveData = ({
  noteId,
  note,
  noteType,
  noteDirection,
}: BuildSaveDataParams) => ({
  id: noteId,
  key: note.key,
  type: noteType,
  uuid: note.uuid,
  text: note.text,
  dir: noteDirection,
  date_created: note.date_created,
  date_modified: computeDateModified(note),
});

export const buildLocalNoteSaveData = ({
  noteId,
  note,
  noteType,
  noteDirection,
}: BuildSaveDataParams): ILocalNote => ({
  ...buildBaseSaveData({
    noteId,
    note,
    noteType,
    noteDirection,
  }),
});

export const buildCloudNoteSaveData = ({
  noteId,
  note,
  noteType,
  noteDirection,
  authorId,
}: BuildSaveDataParams & { authorId?: number }): ICloudNote => ({
  ...buildBaseSaveData({
    noteId,
    note,
    noteType,
    noteDirection,
  }),
  authorId,
  date_synced: 0,
});

export const saveNoteRevision = async (note: LocalNoteProps | CloudNoteProps) => {
  const revision = createNoteRevision(note);

  if (!revision) {
    return;
  }

  const { error: revisionError } = await tryCatch(dbNoteRevisions.save(revision));

  if (revisionError) {
    console.error("Failed to save note revision:", revisionError);
  }
};

const persistSavedNote = async <TSaveData extends ILocalNote | ICloudNote>({
  note,
  saveData,
  markSaved,
}: {
  note: LocalNoteProps | CloudNoteProps;
  saveData: TSaveData;
  markSaved: (saveData: TSaveData) => Promise<boolean>;
}) => {
  await saveNoteRevision(note);
  return markSaved(saveData);
};

export const saveLocalNote = async ({
  noteId,
  note,
  noteType,
  noteDirection,
  markSaved,
}: BuildSaveDataParams & {
  markSaved: (saveData: ILocalNote) => Promise<boolean>;
}) => {
  const saveData = buildLocalNoteSaveData({
    noteId,
    note,
    noteType,
    noteDirection,
  });
  const saved = await persistSavedNote({ note, saveData, markSaved });

  return {
    saved,
    saveData,
  };
};

export const saveCloudNote = async ({
  noteId,
  note,
  noteType,
  noteDirection,
  authorId,
  markSaved,
  uploadNote,
  updateSyncDate,
}: BuildSaveDataParams & {
  authorId?: number;
  markSaved: (saveData: ICloudNote) => Promise<boolean>;
  uploadNote: (
    saveData: ReturnType<typeof buildCloudNoteSaveData>
  ) => Promise<{ success: boolean; note: { dateLastSynced: number } }>;
  updateSyncDate: (payload: { name: string; value: number }) => void;
}) => {
  const saveData = buildCloudNoteSaveData({
    noteId,
    note,
    noteType,
    noteDirection,
    authorId,
  });
  const saved = await persistSavedNote({ note, saveData, markSaved });

  const { error: uploadError, result } = await tryCatch(uploadNote(saveData));

  if (uploadError || !result.success) {
    console.error("Cloud sync failed:", uploadError);
    return {
      saved,
      synced: false,
    };
  }

  updateSyncDate({
    name: saveData.id,
    value: result.note.dateLastSynced,
  });

  return {
    saved,
    synced: true,
  };
};