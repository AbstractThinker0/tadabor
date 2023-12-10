import Dexie from "dexie";

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

class tadaborDatabase extends Dexie {
  notes!: Dexie.Table<INote, string>;
  root_notes!: Dexie.Table<IRootNote, string>;
  translations!: Dexie.Table<ITranslation, string>;
  colors!: Dexie.Table<IColor, string>;
  verses_color!: Dexie.Table<IVerseColor, string>;
  tags!: Dexie.Table<ITag, string>;
  verses_tags!: Dexie.Table<IVerseTags, string>;

  constructor() {
    super("tadaborDatabase");

    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
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
  }
}

const db = new tadaborDatabase();

export const dbFuncs = {
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
  saveTranslation: (data: ITranslation) => {
    return db.translations.put(data);
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
