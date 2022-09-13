// db.js
import Dexie from "dexie";

export const db = new Dexie("tadaborDatabase");
db.version(3).stores({
  notes: "id, text, date_created, date_modified",
  notes_dir: "id, dir",
  root_notes: "id, text, date_created, date_modified",
  root_notes_dir: "id, dir",
});
db.version(2).stores({
  notes: "id, text, date_created, date_modified",
  root_notes: "id, text, date_created, date_modified",
});
db.version(1).stores({
  notes: "id, text, date_created, date_modified", // Primary key and indexed props
});
