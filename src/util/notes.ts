import { v4 as uuidv4 } from "uuid";

interface CreateNewNoteParams {
  id: string;
  text?: string;
  dir?: string;
}

const createNewNote = ({ id, text = "", dir = "" }: CreateNewNoteParams) => {
  const [type, key] = id.split(":");
  const now = Date.now();
  return {
    uuid: uuidv4(),
    id,
    type,
    key,
    text,
    preSave: "",
    dir,
    saved: false,
    date_modified: now,
    date_created: now,
  };
};

export { createNewNote };
