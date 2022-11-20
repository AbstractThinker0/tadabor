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

class tadaborDatabase extends Dexie {
  notes!: Dexie.Table<INote, string>;
  notes_dir!: Dexie.Table<INoteDir, string>;
  root_notes!: Dexie.Table<INote, string>;
  root_notes_dir!: Dexie.Table<INoteDir, string>;
  translations!: Dexie.Table<INote, string>;

  constructor() {
    super("tadaborDatabase");

    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(4).stores({
      notes: "id, text, date_created, date_modified",
      notes_dir: "id, dir",
      root_notes: "id, text, date_created, date_modified",
      root_notes_dir: "id, dir",
      translations: "id, text, date_created, date_modified",
    });
  }
}

export const db = new tadaborDatabase();

export function saveData(store: string, data: INote | INoteDir) {
  return db.table(store).put(data);
}

export function loadData(store: string) {
  return db.table(store).toArray();
}
