import Dexie, { type EntityTable } from "dexie";
import { LetterRole } from "@/util/consts";

export interface INote {
  id: string;
  text: string;
  dir?: string;
  date_created?: number;
  date_modified?: number;
}

export interface IRootNote {
  id: string;
  text: string;
  dir?: string;
  date_created?: number;
  date_modified?: number;
}

export interface ITranslation {
  id: string;
  text: string;
  date_created: number;
  date_modified: number;
}

export interface IColor {
  id: string;
  name: string;
  code: string;
}

export interface IVerseColor {
  verse_key: string;
  color_id: string;
}

export interface ITag {
  id: string;
  name: string;
}

export interface IVerseTags {
  verse_key: string;
  tags_ids: string[];
}

export interface ILetterDefinition {
  id: string;
  name: string;
  definition: string;
  preset_id: string;
  dir?: string;
}

export interface ILettersPreset {
  id: string;
  name: string;
}

export interface ILetterData {
  letter_key: string;
  letter_role: LetterRole;
  def_id: string;
}

class tadaborDatabase extends Dexie {
  notes!: EntityTable<INote, "id">;
  root_notes!: EntityTable<IRootNote, "id">;
  translations!: EntityTable<ITranslation, "id">;

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
    this.version(11).stores({
      notes: "id, text, date_created, date_modified",
      notes_dir: "id, dir",
      root_notes: "id, text, date_created, date_modified",
      root_notes_dir: "id, dir",
      translations: "id, text, date_created, date_modified",
      colors: "id, name, code",
      verses_color: "verse_key, color_id",
      tags: "id, name",
      verses_tags: "verse_key, *tags_ids",
    });

    this.version(15).stores({
      notes: "id, text, dir, date_created, date_modified",
      root_notes: "id, text, dir, date_created, date_modified",
      translations: "id, text, date_created, date_modified",
      colors: "id, name, code",
      verses_color: "verse_key, color_id",
      tags: "id, name",
      verses_tags: "verse_key, *tags_ids",
    });

    this.version(20).stores({
      notes: "id, text, dir, date_created, date_modified",
      root_notes: "id, text, dir, date_created, date_modified",
      translations: "id, text, date_created, date_modified",

      colors: "id, name, code",
      verses_color: "verse_key, color_id",

      tags: "id, name",
      verses_tags: "verse_key, *tags_ids",

      letters_def: "id, preset_id, name, definition, dir",
      letters_presets: "id, name",
      letters_data: "letter_key, letter_role, def_id",
    });
  }
}

const db = new tadaborDatabase();

export const dbFuncs = {
  saveLetterDefinition: (
    preset_id: string,
    name: string,
    definition: string,
    dir: string = ""
  ) => {
    const defKey = preset_id === "-1" ? name : `${name}:${preset_id}`;

    return new Promise((resolve, reject) => {
      db.letters_def
        .update(defKey, { preset_id, name, definition, dir })
        .then((updated) => {
          if (!updated) {
            db.letters_def
              .add({
                id: defKey,
                preset_id,
                name,
                definition,
                dir,
              })
              .then(() => {
                resolve(true); // Resolve the promise on successful add
              })
              .catch((error) => {
                reject(error); // Reject the promise on add error
              });
          } else {
            resolve(true); // Resolve the promise on successful update
          }
        })
        .catch((error) => {
          reject(error); // Reject the promise on update error
        });
    });
  },
  loadLettersDefinition: () => {
    return db.letters_def.toArray();
  },
  saveLetterData: ({
    letter_key,
    letter_role = LetterRole.Unit,
    def_id = "",
  }: {
    letter_key: string;
    letter_role: LetterRole;
    def_id: string;
  }) => {
    return new Promise((resolve, reject) => {
      db.letters_data
        .update(letter_key, { letter_role, def_id })
        .then((updated) => {
          if (!updated) {
            db.letters_data
              .add({
                letter_key,
                letter_role,
                def_id,
              })
              .then(() => {
                resolve(true); // Resolve the promise on successful add
              })
              .catch((error) => {
                reject(error); // Reject the promise on add error
              });
          } else {
            resolve(true); // Resolve the promise on successful update
          }
        })
        .catch((error) => {
          reject(error); // Reject the promise on update error
        });
    });
  },
  loadLettersData: () => {
    return db.letters_data.toArray();
  },
  saveLettersPreset: (id: string, name: string) => {
    return new Promise((resolve, reject) => {
      db.letters_presets
        .update(id, { name })
        .then((updated) => {
          if (!updated) {
            db.letters_presets
              .add({
                id,
                name,
              })
              .then(() => {
                resolve(true); // Resolve the promise on successful add
              })
              .catch((error) => {
                reject(error); // Reject the promise on add error
              });
          } else {
            resolve(true); // Resolve the promise on successful update
          }
        })
        .catch((error) => {
          reject(error); // Reject the promise on update error
        });
    });
  },
  loadLettersPresets: () => {
    return db.letters_presets.toArray();
  },

  saveNote: (id: string, text: string, dir: string) => {
    return new Promise((resolve, reject) => {
      db.notes
        .update(id, { text, dir, date_modified: Date.now() })
        .then((updated) => {
          if (!updated) {
            db.notes
              .add({
                id,
                text,
                dir,
                date_modified: Date.now(),
                date_created: Date.now(),
              })
              .then(() => {
                resolve(true); // Resolve the promise on successful add
              })
              .catch((error) => {
                reject(error); // Reject the promise on add error
              });
          } else {
            resolve(true); // Resolve the promise on successful update
          }
        })
        .catch((error) => {
          reject(error); // Reject the promise on update error
        });
    });
  },
  loadNotes: () => {
    return db.notes.toArray();
  },

  saveRootNote: (id: string, text: string, dir: string) => {
    return new Promise((resolve, reject) => {
      db.root_notes
        .update(id, { text, dir, date_modified: Date.now() })
        .then((updated) => {
          if (!updated) {
            db.root_notes
              .add({
                id,
                text,
                dir,
                date_modified: Date.now(),
                date_created: Date.now(),
              })
              .then(() => {
                resolve(true); // Resolve the promise on successful add
              })
              .catch((error) => {
                reject(error); // Reject the promise on add error
              });
          } else {
            resolve(true); // Resolve the promise on successful update
          }
        })
        .catch((error) => {
          reject(error); // Reject the promise on update error
        });
    });
  },
  loadRootNotes: () => {
    return db.root_notes.toArray();
  },

  loadTranslations: () => {
    return db.translations.toArray();
  },
  saveTranslation: (id: string, text: string) => {
    return new Promise((resolve, reject) => {
      db.translations
        .update(id, { text, date_modified: Date.now() })
        .then((updated) => {
          if (!updated) {
            db.translations
              .add({
                id,
                text,
                date_modified: Date.now(),
                date_created: Date.now(),
              })
              .then(() => {
                resolve(true); // Resolve the promise on successful add
              })
              .catch((error) => {
                reject(error); // Reject the promise on add error
              });
          } else {
            resolve(true); // Resolve the promise on successful update
          }
        })
        .catch((error) => {
          reject(error); // Reject the promise on update error
        });
    });
  },

  saveColor: (data: IColor) => {
    return db.colors.put(data);
  },
  loadColors: () => {
    return db.colors.toArray();
  },
  deleteColor: (id: string) => {
    return db.colors.delete(id);
  },
  saveVerseColor: (data: IVerseColor) => {
    return db.verses_color.put(data);
  },
  deleteVerseColor: (verse_key: string) => {
    return db.verses_color.delete(verse_key);
  },
  loadVersesColor: () => {
    return db.verses_color.toArray();
  },

  saveTag: (data: ITag) => {
    return db.tags.put(data);
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
    return db.verses_tags.put(data);
  },
  deleteVerseTags: (verse_key: string) => {
    return db.verses_tags.delete(verse_key);
  },
  loadVersesTags: () => {
    return db.verses_tags.toArray();
  },
};
