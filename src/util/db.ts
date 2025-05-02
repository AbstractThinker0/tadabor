import Dexie, { type EntityTable } from "dexie";
import { LetterRole } from "@/util/consts";
import { v4 as uuidv4 } from "uuid";

// Common fields
export interface ISyncable {
  uuid?: string;
  syncedAt?: number;
  deleted?: boolean;
  ownerId?: string;
}

// Specific interfaces

export interface ILocalNote extends ISyncable {
  id: string;
  key: string;
  type: string;
  text: string;
  dir?: string;
  date_created?: number;
  date_modified?: number;
}

export interface INote extends ISyncable {
  id: string;
  text: string;
  dir?: string;
  date_created?: number;
  date_modified?: number;
}

export interface IRootNote extends ISyncable {
  id: string;
  text: string;
  dir?: string;
  date_created?: number;
  date_modified?: number;
}

export interface ITranslation extends ISyncable {
  id: string;
  text: string;
  dir?: string;
  date_created?: number;
  date_modified?: number;
}

export interface IColor extends ISyncable {
  id: string;
  name: string;
  code: string;
}

export interface IVerseColor extends ISyncable {
  verse_key: string;
  color_id: string;
}

export interface ITag extends ISyncable {
  id: string;
  name: string;
}

export interface IVerseTags extends ISyncable {
  verse_key: string;
  tags_ids: string[];
}

export interface ILetterDefinition extends ISyncable {
  id: string;
  name: string;
  definition: string;
  preset_id: string;
  dir?: string;
}

export interface ILettersPreset extends ISyncable {
  id: string;
  name: string;
}

export interface ILetterData extends ISyncable {
  letter_key: string;
  letter_role: LetterRole;
  def_id: string;
}

class tadaborDatabase extends Dexie {
  notes!: EntityTable<INote, "id">;
  root_notes!: EntityTable<IRootNote, "id">;
  translations!: EntityTable<ITranslation, "id">;

  local_notes!: EntityTable<ILocalNote, "id">;

  colors!: EntityTable<IColor, "id">;
  verses_color!: EntityTable<IVerseColor, "verse_key">;

  tags!: EntityTable<ITag, "id">;
  verses_tags!: EntityTable<IVerseTags, "verse_key">;

  letters_def!: EntityTable<ILetterDefinition, "id">;
  letters_presets!: EntityTable<ILettersPreset, "id">;
  letters_data!: EntityTable<ILetterData, "letter_key">;

  constructor() {
    super("tadaborDatabase");

    //
    // (Here's where the implicit table props are dynamically created)
    // Increase the table version whenever you make changes to the current stores structure
    //
    this.version(21).stores({
      notes: "id, text, dir, date_created, date_modified",
      root_notes: "id, text, dir, date_created, date_modified",
      translations: "id, text, dir, date_created, date_modified",

      colors: "id, name, code",
      verses_color: "verse_key, color_id",

      tags: "id, name",
      verses_tags: "verse_key, *tags_ids",

      letters_def: "id, preset_id, name, definition, dir",
      letters_presets: "id, name",
      letters_data: "letter_key, letter_role, def_id",
    });

    this.version(22)
      .stores({
        notes: "id, uuid, text, dir, date_created, date_modified",
        root_notes: "id, uuid, text, dir, date_created, date_modified",
        translations: "id, uuid, text, dir, date_created, date_modified",

        colors: "id, uuid, name, code",
        verses_color: "verse_key, uuid, color_id",

        tags: "id, uuid, name",
        verses_tags: "verse_key, uuid, *tags_ids",

        letters_def: "id, uuid, preset_id, name, definition, dir",
        letters_presets: "id, uuid, name",
        letters_data: "letter_key, uuid, letter_role, def_id",
      })
      .upgrade(async (tx) => {
        const tableNames = [
          "notes",
          "root_notes",
          "translations",
          "colors",
          "verses_color",
          "tags",
          "verses_tags",
          "letters_def",
          "letters_presets",
          "letters_data",
        ];

        for (const tableName of tableNames) {
          const table = tx.table(tableName);

          const rows = await table.toArray();

          for (const row of rows) {
            if (!row.uuid) {
              row.uuid = uuidv4();
              await table.put(row);
            }
          }
        }
      });

    this.version(23)
      .stores({
        local_notes:
          "id, uuid, key, type, text, dir, date_created, date_modified",
      })
      .upgrade(async (tx) => {
        const mapping = {
          notes: "verse",
          root_notes: "root",
          translations: "translation",
        };

        for (const [tableName, noteType] of Object.entries(mapping)) {
          const table = tx.table(tableName);

          const rows = await table.toArray();

          const localNotesTable = tx.table("local_notes");

          for (const row of rows) {
            await localNotesTable.put({
              id: `${noteType}:${row.id}`,
              key: row.id,
              uuid: row.uuid ?? uuidv4(),
              type: noteType,
              text: row.text,
              dir: row.dir,
              date_created: row.date_created,
              date_modified: row.date_modified,
            });
          }
        }
      });
  }
}

const db = new tadaborDatabase();

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
    letter_role: LetterRole;
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

  saveNote: (id: string, text: string, dir: string) =>
    dbFuncs.saveLocalNote("verse", id, text, dir),

  loadNotes: () => dbFuncs.loadLocalNotesByType("verse"),

  saveRootNote: (id: string, text: string, dir: string) =>
    dbFuncs.saveLocalNote("root", id, text, dir),

  loadRootNotes: () => dbFuncs.loadLocalNotesByType("root"),

  saveTranslation: (id: string, text: string, dir: string = "") =>
    dbFuncs.saveLocalNote("translation", id, text, dir),

  loadTranslations: () => dbFuncs.loadLocalNotesByType("translation"),

  // New unified APIs
  saveLocalNote: async (
    type: "verse" | "root" | "translation",
    id: string,
    text: string,
    dir: string = ""
  ) => {
    const now = Date.now();
    const localId = `${type}:${id}`;

    const updated = await db.local_notes.update(localId, {
      text,
      dir,
      date_modified: now,
    });

    if (updated) return true;

    await db.local_notes.add({
      id: localId,
      uuid: uuidv4(),
      key: id,
      type,
      text,
      dir,
      date_created: now,
      date_modified: now,
    });

    return true;
  },

  loadLocalNotesByType: async (type: "verse" | "root" | "translation") => {
    return db.local_notes.where("type").equals(type).toArray();
  },

  loadAllLocalNotes: () => {
    return db.local_notes.toArray();
  },
  saveColor: (data: IColor) => {
    return db.colors.put({ ...data, uuid: uuidv4() });
  },
  loadColors: () => {
    return db.colors.toArray();
  },
  deleteColor: (id: string) => {
    return db.colors.delete(id);
  },
  saveVerseColor: (data: IVerseColor) => {
    return db.verses_color.put({ ...data, uuid: uuidv4() });
  },
  deleteVerseColor: (verse_key: string) => {
    return db.verses_color.delete(verse_key);
  },
  loadVersesColor: () => {
    return db.verses_color.toArray();
  },

  saveTag: (data: ITag) => {
    return db.tags.put({ ...data, uuid: uuidv4() });
  },
  deleteTag: (id: string) => {
    db.tags.delete(id);

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
  saveVerseTags: (data: IVerseTags) => {
    return db.verses_tags.put({ ...data, uuid: uuidv4() });
  },
  deleteVerseTags: (verse_key: string) => {
    return db.verses_tags.delete(verse_key);
  },
  loadVersesTags: () => {
    return db.verses_tags.toArray();
  },
};
