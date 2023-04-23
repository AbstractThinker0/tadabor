import Dexie from "dexie";

export interface INote {
  id: string;
  text: string;
  date_created: number;
  date_modified: number;
}

export interface INoteDir {
  id: string;
  dir: string;
}

export interface IRootNote {
  id: string;
  text: string;
  date_created: number;
  date_modified: number;
}

export interface IRootNoteDir {
  id: string;
  dir: string;
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

class tadaborDatabase extends Dexie {
  notes!: Dexie.Table<INote, string>;
  notes_dir!: Dexie.Table<INoteDir, string>;
  root_notes!: Dexie.Table<IRootNote, string>;
  root_notes_dir!: Dexie.Table<IRootNoteDir, string>;
  translations!: Dexie.Table<ITranslation, string>;
  colors!: Dexie.Table<IColor, string>;
  verses_color!: Dexie.Table<IVerseColor, string>;

  constructor() {
    super("tadaborDatabase");

    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(8).stores({
      notes: "id, text, date_created, date_modified",
      notes_dir: "id, dir",
      root_notes: "id, text, date_created, date_modified",
      root_notes_dir: "id, dir",
      translations: "id, text, date_created, date_modified",
      colors: "id, name, code",
      verses_color: "verse_key, color_id",
    });
  }
}

const db = new tadaborDatabase();

export const dbFuncs = {
  saveNote: (data: INote) => {
    return db.notes.put(data);
  },
  loadNotes: () => {
    return db.notes.toArray();
  },
  saveNoteDir: (data: INoteDir) => {
    return db.notes_dir.put(data);
  },
  loadNotesDir: () => {
    return db.notes_dir.toArray();
  },
  saveRootNote: (data: IRootNote) => {
    return db.root_notes.put(data);
  },
  loadRootNotes: () => {
    return db.root_notes.toArray();
  },
  saveRootNoteDir: (data: IRootNoteDir) => {
    return db.root_notes_dir.put(data);
  },
  loadRootNotesDir: () => {
    return db.root_notes_dir.toArray();
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
};
