import { qbStateProps } from "@/components/QuranBrowser/consts";
import { searchIndexProps, verseMatchResult } from "@/types";
import quranClass from "@/util/quranService";
import { onlySpaces, getDerivationsInVerse } from "@/util/util";

export function qbSearchRoot(
  state: qbStateProps,
  quranService: quranClass
): qbStateProps {
  // Deconstruct current state
  const { searchString, searchMethod, selectedChapters } = state;
  // initial search state
  const newState: qbStateProps = {
    ...state,
    searchError: false,
    searchResult: [],
    searchIndexes: [],
    searchingString: searchString,
    searchingMethod: searchMethod,
    searchingChapters: selectedChapters.map((chapterID) =>
      quranService.getChapterName(chapterID)
    ),
    scrollKey: "",
  };

  if (onlySpaces(searchString)) {
    return { ...newState, searchError: true };
  }

  const rootTarget = quranService.getRootByName(searchString);

  if (rootTarget === undefined) {
    return { ...newState, searchError: true };
  }

  const occurencesArray = rootTarget.occurences;

  const matchVerses: verseMatchResult[] = [];
  const derivations: searchIndexProps[] = [];

  if (selectedChapters.length) {
    occurencesArray.forEach((item) => {
      const info = item.split(":");
      const currentVerse = quranService.getVerseByRank(info[0]);

      if (selectedChapters.includes(currentVerse.suraid)) {
        const wordIndexes = info[1].split(",");

        const chapterName = quranService.getChapterName(currentVerse.suraid);

        const { verseDerivations, verseResult } = getDerivationsInVerse(
          wordIndexes,
          currentVerse,
          chapterName
        );

        derivations.push(...verseDerivations);
        matchVerses.push(verseResult);
      }
    });
  }

  if (matchVerses.length === 0) {
    return { ...newState, searchError: true };
  }

  return {
    ...newState,
    searchResult: matchVerses,
    searchIndexes: derivations,
  };
}
