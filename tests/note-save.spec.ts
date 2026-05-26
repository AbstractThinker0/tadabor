import { expect, test } from "@playwright/test";

import type { ILocalNote, INoteRevision } from "../src/types/db";
import {
  buildCloudNoteSaveData,
  buildLocalNoteSaveData,
  saveCloudNote,
  saveLocalNote,
  saveNoteRevision,
} from "../src/services/noteSave";
import { dbNoteRevisions } from "../src/util/dbFuncs";

test.describe("note save helpers", () => {
  test("builds cloud save data with sync metadata for changed translation notes", () => {
    const saveData = buildCloudNoteSaveData({
      noteId: "translation:2-255",
      note: {
        id: "translation:2-255",
        uuid: "note-uuid",
        key: "2-255",
        type: "translation",
        text: "Ayat 2-255 note",
        preSave: "Previous note",
        preSaveDir: "ltr",
        dir: "ltr",
        date_created: 100,
        date_modified: 200,
      },
      noteType: "translation",
      noteDirection: "ltr",
      authorId: 7,
    });

    expect(saveData).toMatchObject({
      id: "translation:2-255",
      key: "2-255",
      type: "translation",
      uuid: "note-uuid",
      text: "Ayat 2-255 note",
      dir: "ltr",
      date_created: 100,
      authorId: 7,
      date_synced: 0,
    });
    expect(saveData.date_modified).toBeGreaterThanOrEqual(200);
  });

  test("preserves modified date for unchanged local note saves", () => {
    const saveData = buildLocalNoteSaveData({
      noteId: "verse:1-1",
      note: {
        id: "verse:1-1",
        uuid: "verse-note-uuid",
        key: "1-1",
        type: "verse",
        text: "Steady note",
        preSave: "Steady note",
        preSaveDir: "",
        dir: "",
        date_created: 10,
        date_modified: 20,
      },
      noteType: "verse",
      noteDirection: "",
    });

    expect(saveData).toEqual({
      id: "verse:1-1",
      key: "1-1",
      type: "verse",
      uuid: "verse-note-uuid",
      text: "Steady note",
      dir: "",
      date_created: 10,
      date_modified: 20,
    });
  });

  test("persists a revision when a saved note changes", async () => {
    const revisions: INoteRevision[] = [];
    const originalSave = dbNoteRevisions.save;

    dbNoteRevisions.save = async (revision) => {
      revisions.push(revision);
      return true;
    };

    try {
      await saveNoteRevision({
        id: "verse:1-1",
        uuid: "note-uuid",
        key: "1-1",
        type: "verse",
        text: "Updated note text",
        preSave: "Original note text",
        preSaveDir: "",
        dir: "",
        hasPersistedVersion: true,
        date_created: 10,
        date_modified: 20,
      });
    } finally {
      dbNoteRevisions.save = originalSave;
    }

    expect(revisions).toHaveLength(1);
    expect(revisions[0]).toMatchObject({
      note_id: "verse:1-1",
      note_uuid: "note-uuid",
      note_type: "verse",
      note_key: "1-1",
      text: "Original note text",
      dir: "",
      note_date_modified: 20,
    });
  });

  test("saves local notes through the shared service", async () => {
    const savedPayloads: ILocalNote[] = [];
    const originalSave = dbNoteRevisions.save;

    dbNoteRevisions.save = async () => true;

    let result;

    try {
      result = await saveLocalNote({
        noteId: "verse:1-1",
        note: {
          id: "verse:1-1",
          uuid: "local-note-uuid",
          key: "1-1",
          type: "verse",
          text: "Fresh local note",
          preSave: "",
          preSaveDir: "",
          dir: "",
          hasPersistedVersion: false,
          date_created: 10,
          date_modified: 20,
        },
        noteType: "verse",
        noteDirection: "",
        markSaved: async (saveData) => {
          savedPayloads.push(saveData);
          return true;
        },
      });
    } finally {
      dbNoteRevisions.save = originalSave;
    }

    expect(result.saved).toBe(true);
    expect(savedPayloads).toHaveLength(1);
    expect(savedPayloads[0]).toMatchObject({
      id: "verse:1-1",
      key: "1-1",
      type: "verse",
      text: "Fresh local note",
    });
  });

  test("uploads cloud notes and updates the sync date through the shared service", async () => {
    const syncUpdates: Array<{ name: string; value: number }> = [];
    const originalSave = dbNoteRevisions.save;

    dbNoteRevisions.save = async () => true;

    let result;

    try {
      result = await saveCloudNote({
        noteId: "translation:2-255",
        note: {
          id: "translation:2-255",
          uuid: "cloud-note-uuid",
          key: "2-255",
          type: "translation",
          text: "Cloud note",
          preSave: "Older cloud note",
          preSaveDir: "ltr",
          dir: "ltr",
          hasPersistedVersion: true,
          date_created: 100,
          date_modified: 200,
        },
        noteType: "translation",
        noteDirection: "ltr",
        authorId: 9,
        markSaved: async () => true,
        uploadNote: async () => ({
          success: true,
          note: { dateLastSynced: 456 },
        }),
        updateSyncDate: (payload) => {
          syncUpdates.push(payload);
        },
      });
    } finally {
      dbNoteRevisions.save = originalSave;
    }

    expect(result).toEqual({
      saved: true,
      synced: true,
    });
    expect(syncUpdates).toEqual([
      {
        name: "translation:2-255",
        value: 456,
      },
    ]);
  });

  test("still uploads cloud notes when local markSaved fails", async () => {
    const uploads: string[] = [];
    const syncUpdates: Array<{ name: string; value: number }> = [];
    const originalSave = dbNoteRevisions.save;

    dbNoteRevisions.save = async () => true;

    let result;

    try {
      result = await saveCloudNote({
        noteId: "translation:3-7",
        note: {
          id: "translation:3-7",
          uuid: "cloud-note-fail-local",
          key: "3-7",
          type: "translation",
          text: "Upload even if local save fails",
          preSave: "Previous value",
          preSaveDir: "ltr",
          dir: "ltr",
          hasPersistedVersion: true,
          date_created: 100,
          date_modified: 200,
        },
        noteType: "translation",
        noteDirection: "ltr",
        authorId: 10,
        markSaved: async () => false,
        uploadNote: async (saveData) => {
          uploads.push(saveData.id);
          return {
            success: true,
            note: { dateLastSynced: 789 },
          };
        },
        updateSyncDate: (payload) => {
          syncUpdates.push(payload);
        },
      });
    } finally {
      dbNoteRevisions.save = originalSave;
    }

    expect(result).toEqual({
      saved: false,
      synced: true,
    });
    expect(uploads).toEqual(["translation:3-7"]);
    expect(syncUpdates).toEqual([
      {
        name: "translation:3-7",
        value: 789,
      },
    ]);
  });
});
