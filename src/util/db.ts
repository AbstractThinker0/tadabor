import Dexie, { type EntityTable } from "dexie";

import { v4 as uuidv4 } from "uuid";

import type {
  ILocalNote,
  ICloudNote,
  IColor,
  IVerseColor,
  ITag,
  IVerseTags,
  ILetterDefinition,
  ILettersPreset,
  ILetterData,
} from "@/types/db";

class tadaborDatabase extends Dexie {
  local_notes!: EntityTable<ILocalNote, "id">;
  cloud_notes!: EntityTable<ICloudNote, "id">;

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

    this.version(26).stores({
      cloud_notes:
        "id, uuid, authorId, key, type, text, dir, date_created, date_modified, date_synced, isDeleted, isPublished",
    });
  }
}

export const db = new tadaborDatabase();

export * from "@/types/db";
