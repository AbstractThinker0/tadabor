import { selectedChaptersType } from "@/types";

/*
    qfs = Quran Font Size
    nfs = Notes Font Size
*/

const qfsStored = "qfsStored";
const qfsDefault = 1.625;

const nfsStored = "nfsStored";
const nfsDefault = 1.25;

const initialSelectedChapters = (() => {
  const obj: selectedChaptersType = {};

  for (let i = 1; i <= 114; i++) {
    obj[i.toString()] = true;
  }

  return obj;
})();

export {
  qfsStored,
  qfsDefault,
  nfsStored,
  nfsDefault,
  initialSelectedChapters,
};
