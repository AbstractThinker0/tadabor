// db.js
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
  root_notes!: Dexie.Table<INote, string>;
  root_notes_dir!: Dexie.Table<INoteDir, string>;
  translations!: Dexie.Table<INote, string>;
  colors!: Dexie.Table<IColor, string>;
  verses_color!: Dexie.Table<IVerseColor, string>;

  constructor() {
    super("tadaborDatabase");

    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(7).stores({
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

export function saveData(store: string, data: INote | INoteDir) {
  return db.table(store).put(data);
}

export function loadData(store: string) {
  return db.table(store).toArray();
}

export function dbSaveColor(data: IColor) {
  return db.colors.put(data);
}

export function dbLoadColors() {
  return db.colors.toArray();
}

export function dbDeleteColor(id: string) {
  return db.colors.delete(id);
}

export function dbSaveVerseColor(data: IVerseColor) {
  return db.verses_color.put(data);
}

export function dbDeleteVerseColor(verse_key: string) {
  return db.verses_color.delete(verse_key);
}

export function dbLoadVersesColor() {
  return db.verses_color.toArray();
}
