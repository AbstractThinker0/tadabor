import type { selectedChaptersType } from "@/types";

const fontsList = [
  "Scheherazade New",
  "Cairo",
  "Amiri",
  "Lateef",
  "Noto Naskh Arabic",
];

/*
    qf = Quran Font
    nf = Notes Font
*/

const qfStored = "qfStored";
const qfDefault = "Scheherazade New";

const nfStored = "nfStored";
const nfDefault = "Scheherazade New";

/*
    qfs = Quran Font Size
    nfs = Notes Font Size
*/

const qfsStored = "qfsStored";
const qfsDefault = 1.4;

const nfsStored = "nfsStored";
const nfsDefault = 1.2;

const initialSelectedChapters = (() => {
  const obj: selectedChaptersType = {};

  for (let i = 1; i <= 114; i++) {
    obj[i.toString()] = true;
  }

  return obj;
})();

const LetterRole = {
  Unit: 0,
  Suffix: 1,
  Ignored: 2,
};

export type LetterRoleType = (typeof LetterRole)[keyof typeof LetterRole];

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
  fontsList,
  qfDefault,
  qfStored,
  nfDefault,
  nfStored,
  qfsStored,
  qfsDefault,
  nfsStored,
  nfsDefault,
  initialSelectedChapters,
  LetterRole,
  arabicAlphabetDefault,
};
