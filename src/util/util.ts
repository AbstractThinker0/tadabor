import { IMatch } from "@/types";

export function normalizeAlif(token: string) {
  return token.replace(/(آ|إ|أ)/g, "ا");
}

export function onlySpaces(str: string) {
  return str.trim().length === 0;
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
  "ء",
  "ؤ",
  "ئ",
];

export function removeDiacritics(input: string): string {
  return input.replace(/[\u064B-\u0652\u0670\u0640]/g, "");
}

function isValidArabicLetter(char: string) {
  return validArabicLetters.includes(char);
}

function splitArabicLetters(arabicText: string) {
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

/**
 * Escapes special characters in a string to be used as a literal in a regular expression pattern.
 * @param {string} string - The input string to escape.
 * @returns {string} The escaped string with special characters replaced by their escaped versions.
 */
function escapeRegex(string: string): string {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
}

/**
 * Creates a regular expression that matches the provided term bounded by whitespace characters or start/end.
 * @param term - The term to match.
 * @returns A regular expression that matches the term bounded by whitespace characters or start/end.
 */
function identicalRegex(term: string): RegExp {
  const startBoundary = term.charAt(0) === " " ? "" : "(?<=^|\\s)";
  const endBoundary = term.charAt(term.length - 1) === " " ? "" : "(?=\\s|$)";
  const regexPattern = `(${startBoundary}${escapeRegex(term)}${endBoundary})`;

  return new RegExp(regexPattern);
}

interface IMatchOptions {
  ignoreDiacritics?: boolean;
  matchIdentical?: boolean;
}

export function getMatches(
  text: string,
  searchToken: string,
  matchOptions: IMatchOptions
) {
  if (!searchToken.trim() || !text.trim()) {
    return false;
  }

  const { ignoreDiacritics = false, matchIdentical = false } = matchOptions; // Destructure options with default values

  const normalizedText = ignoreDiacritics ? removeDiacritics(text) : text;

  // Check whether we can find any matches
  const isTokenFound = matchIdentical
    ? identicalRegex(searchToken).test(normalizedText)
    : normalizedText.includes(searchToken);

  if (!isTokenFound) {
    return false;
  }

  // using RegExp with () here because we want to include the searchToken as a separate part in the resulting array.
  const regex = matchIdentical
    ? identicalRegex(searchToken)
    : new RegExp(`(${escapeRegex(searchToken)})`);

  const parts = normalizedText.split(regex).filter((part) => part !== "");

  const splittedLetters = splitArabicLetters(text);

  const traversedLength: [number] = [0];

  const getOriginalPart = (part: string) => {
    const skeletonPart = removeDiacritics(part);

    const indexOfPart = normalizedText.indexOf(
      skeletonPart,
      traversedLength[0]
    );

    traversedLength[0] += skeletonPart.length;

    return splittedLetters
      .slice(indexOfPart, indexOfPart + skeletonPart.length)
      .join("");
  };

  const matchParts: IMatch[] = parts.map((part) => {
    const partText = ignoreDiacritics ? getOriginalPart(part) : part;

    const currentPart: IMatch = {
      text: partText,
      isMatch: part === searchToken,
    };

    return currentPart;
  });

  return matchParts;
}

export function hasAllLetters(str: string, token: string) {
  const tokenMap = new Map();
  const strMap = new Map();

  for (const char of token) {
    tokenMap.set(char, (tokenMap.get(char) || 0) + 1);
  }

  for (const char of str) {
    strMap.set(char, (strMap.get(char) || 0) + 1);
  }

  for (const [char, count] of tokenMap) {
    if (!strMap.has(char) || strMap.get(char) < count) {
      return false;
    }
  }

  return true;
}

export function getRootMatches(verseWords: string[], wordIndexes: string[]) {
  const verseParts = <IMatch[]>[];
  let segment = "";

  for (let i = 0; i < verseWords.length; i++) {
    // this word index is a root derivative
    if (wordIndexes.includes((i + 1).toString())) {
      // If he have built a segment of non-matches push it
      if (segment) {
        verseParts.push({ text: segment, isMatch: false });
        segment = "";
      }

      // push the actual match
      verseParts.push({ text: verseWords[i], isMatch: true });
    } else {
      // keep a space around the added words, The browser will get rid of any extra spaces ( TODO: Actually verify this behavior is consistent among different browsers other than the chromium based ones )
      segment = segment.concat(` ${verseWords[i]} `);
    }
  }

  if (segment) {
    verseParts.push({ text: segment, isMatch: false });
  }

  return verseParts;
}
