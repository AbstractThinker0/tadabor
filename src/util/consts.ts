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

enum LetterRole {
  Unit,
  Suffix,
  Ignored,
}

// 28 Letters
const arabicAlphabetDefault = [
  "أ",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "ه",
  "و",
  "ي",
];

export {
  qfsStored,
  qfsDefault,
  nfsStored,
  nfsDefault,
  initialSelectedChapters,
  LetterRole,
  arabicAlphabetDefault,
};
