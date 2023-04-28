export function normalizeAlif(token: string) {
  token = token.replace(/(ٱ)/g, "ا");
  token = token.replace(/(آ)/g, "ا");
  token = token.replace(/(إ)/g, "ا");
  return token;
}

export function onlySpaces(str: string) {
  return str.trim().length === 0;
}

/**
 * Checks if a word or sentence is present in a string, and is bounded by whitespace characters.
 * @param term - The word or sentence to search for.
 * @param str - The string to search in.
 * @returns `true` if the term is found and bounded by whitespace characters, `false` otherwise.
 */
export function findSubstring(term: string, str: string): boolean {
  const regex = new RegExp(`(^|\\s)${term}(\\s|$)`, "u");
  return regex.test(str);
}

export function splitByArray(text: string, separators: string[]) {
  const regex = new RegExp(`(${separators.join("|")})`);
  return text.split(regex).filter(Boolean);
}

const validArabicLetters = [
  "ا",
  "أ",
  "إ",
  "آ",
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
  "ى",
  "ة",
];

function removeInvalidCharacters(input: string, validChars: string[]): string {
  return input
    .split("")
    .filter((char) => validChars.includes(char) || onlySpaces(char))
    .join("");
}

export function removeDiacritics(input: string): string {
  return removeInvalidCharacters(input, validArabicLetters);
}

function isValidArabicLetter(char: string) {
  return validArabicLetters.includes(char);
}

export function splitArabicLetters(arabicText: string) {
  const result = [];

  for (const char of arabicText) {
    if (!onlySpaces(char) && !isValidArabicLetter(char)) {
      result[result.length - 1] += char;
    } else {
      result.push(char);
    }
  }

  return result;
}
