export function normalizeArabic(text: string) {
  //normalize Arabic
  text = text.replace(/(ٱ)/g, "ا");

  //remove special characters
  text = text.replace(
    /([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g,
    ""
  );

  return text;
}

export function normalizeAlif(token: string) {
  token = token.replace(/(ٱ)/g, "ا");
  token = token.replace(/(آ)/g, "ا");
  token = token.replace(/(إ)/g, "ا");
  return token;
}

export function onlySpaces(str: string) {
  return str.trim().length === 0;
}

// Take into consideration Arabic boundaries
export function findArabicWord(word: string, str: string) {
  return RegExp("(^|[^\u0621-\u064A])" + word + "($|[^\u0621-\u064A])").test(
    str
  );
}
