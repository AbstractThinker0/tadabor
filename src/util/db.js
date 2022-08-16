// db.js
import Dexie from "dexie";

export const db = new Dexie("tadaborDatabase");
db.version(1).stores({
  notes: "id, text, date_created, date_modified", // Primary key and indexed props
});
