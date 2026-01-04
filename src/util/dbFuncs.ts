import { v4 as uuidv4 } from "uuid";
import { db } from "./db";

import type {
  ICloudNote,
  IColor,
  IVerseColor,
  ITag,
  IVerseTags,
} from "@/types/db";
import { LetterRole, type LetterRoleType } from "@/util/consts";

export const dbFuncs = {
  saveLetterDefinition: async (
    preset_id: string,
    name: string,
    definition: string,
    dir: string = ""
  ) => {
    const defKey = preset_id === "-1" ? name : `${name}:${preset_id}`;

    const updated = await db.letters_def.update(defKey, {
      preset_id,
      name,
      definition,
      dir,
    });

    if (updated) return true;

    await db.letters_def.add({
      id: defKey,
      uuid: uuidv4(),
      preset_id,
      name,
      definition,
      dir,
    });

    return true;
  },
  loadLettersDefinition: () => {
    return db.letters_def.toArray();
  },
  saveLetterData: async ({
    letter_key,
    letter_role = LetterRole.Unit,
    def_id = "",
  }: {
    letter_key: string;
    letter_role: LetterRoleType;
    def_id: string;
  }) => {
    const updated = await db.letters_data.update(letter_key, {
      letter_role,
      def_id,
    });

    if (updated) return true;

    await db.letters_data.add({
      letter_key,
      uuid: uuidv4(),
      letter_role,
      def_id,
    });

    return true;
  },
  loadLettersData: () => {
    return db.letters_data.toArray();
  },
  saveLettersPreset: async (id: string, name: string) => {
    const updated = await db.letters_presets.update(id, { name });

    if (updated) return true;

    await db.letters_presets.add({
      id,
      uuid: uuidv4(),
      name,
    });

    return true;
  },
  loadLettersPresets: () => {
    return db.letters_presets.toArray();
  },

  saveTag: async (data: ITag) => {
    const { id, ...rest } = data;
    const updated = await db.tags.update(id, rest);

    if (updated) return true;

    return db.tags.add({ ...data, uuid: uuidv4() });
  },
  deleteTag: (id: string) => {
    db.tags.delete(id);

    // Uses multi-entry index on tags_ids
    db.verses_tags
      .where("tags_ids")
      .equals(id)
      .modify((verseTag) => {
        verseTag.tags_ids = verseTag.tags_ids.filter((tagID) => tagID !== id);
      });
  },
  loadTags: () => {
    return db.tags.toArray();
  },
  saveVerseTags: async (data: IVerseTags) => {
    const { verse_key, ...rest } = data;
    const updated = await db.verses_tags.update(verse_key, rest);

    if (updated) return true;

    return db.verses_tags.add({ ...data, uuid: uuidv4() });
  },
  deleteVerseTags: (verse_key: string) => {
    return db.verses_tags.delete(verse_key);
  },
  loadVersesTags: () => {
    return db.verses_tags.toArray();
  },
};

export const dbColors = {
  save: async (data: IColor) => {
    const { id, ...rest } = data;
    const updated = await db.colors.update(id, rest);

    if (updated) return true;

    return db.colors.add({ ...data });
  },
  loadAll: () => {
    return db.colors.toArray();
  },
  delete: async (id: string) => {
    await db.verses_color.where("color_id").equals(id).delete();
    return db.colors.delete(id);
  },
  saveBulk: async (data: IColor[]) => {
    return db.colors.bulkPut(data);
  },
  saveVerse: async (data: IVerseColor) => {
    const { verse_key, ...rest } = data;
    const updated = await db.verses_color.update(verse_key, rest);

    if (updated) return true;

    return db.verses_color.add({ ...data });
  },
  deleteVerse: (verse_key: string) => {
    return db.verses_color.delete(verse_key);
  },
  loadVerses: () => {
    return db.verses_color.toArray();
  },
};

export const dbNotes = {
  saveLocal: async ({
    key,
    type,
    uuid,
    id,
    text,
    dir = "",
    date_created,
    date_modified,
  }: {
    type: "verse" | "root" | "translation" | string;
    uuid: string;
    id: string;
    key: string;
    text: string;
    dir?: string;
    date_created?: number;
    date_modified?: number;
  }) => {
    const updated = await db.local_notes.update(id, {
      text,
      dir,
      date_modified,
    });

    if (updated) return true;

    await db.local_notes.add({
      id,
      uuid,
      key,
      type,
      text,
      dir,
      date_created,
      date_modified,
    });

    return true;
  },
  loadAllLocal: () => {
    return db.local_notes.toArray();
  },
  loadAllCloud: (userid: number) => {
    return db.cloud_notes.where("authorId").equals(userid).toArray();
  },
  loadLocal: (id: string) => {
    return db.local_notes.get(id);
  },
  loadCloud: (id: string, userid: number) => {
    return db.cloud_notes
      .where("id")
      .equals(id)
      .and((note) => note.authorId === userid)
      .first();
  },
  saveCloud: async (note: ICloudNote) => {
    const updated = await db.cloud_notes.update(note.id, {
      ...note,
    });

    if (updated) return true;

    await db.cloud_notes.add(note);

    return true;
  },
  updateCloudSyncDate: async (id: string, date_synced: number) => {
    return db.cloud_notes.update(id, { date_synced });
  },
  clearAllCloud: () => {
    return db.cloud_notes.clear();
  },
};
