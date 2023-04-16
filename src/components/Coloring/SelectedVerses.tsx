import useQuran from "../../context/QuranContext";

import { coloredProps } from "./consts";
import { getTextColor } from "./util";

interface SelectedVersesProps {
  coloredVerses: coloredProps;
  selectedColors: coloredProps;
}

function SelectedVerses({
  coloredVerses,
  selectedColors,
}: SelectedVersesProps) {
  const { allQuranText, chapterNames } = useQuran();

  function getVerseByKey(key: string) {
    let info = key.split("-");
    return allQuranText[Number(info[0]) - 1].verses[Number(info[1]) - 1];
  }

  let selectedVerses = Object.keys(coloredVerses).filter((verseKey) =>
    Object.keys(selectedColors).includes(coloredVerses[verseKey].colorID)
  );

  return (
    <div>
      {selectedVerses.length ? (
        selectedVerses
          .sort((keyA, KeyB) => {
            let infoA = keyA.split("-");
            let infoB = KeyB.split("-");
            if (Number(infoA[0]) !== Number(infoB[0]))
              return Number(infoA[0]) - Number(infoB[0]);
            else return Number(infoA[1]) - Number(infoB[1]);
          })
          .map((verseKey) => {
            let verse = getVerseByKey(verseKey);
            return (
              <div
                className="verse-item"
                key={verseKey}
                style={{
                  backgroundColor: coloredVerses[verseKey].colorCode,
                  color: getTextColor(coloredVerses[verseKey].colorCode),
                }}
              >
                {verse.versetext} (
                {chapterNames[Number(verse.suraid) - 1].name +
                  ":" +
                  verse.verseid}
                )
              </div>
            );
          })
      ) : (
        <p className="text-center">
          There are no verses matching the selected colors
        </p>
      )}
    </div>
  );
}

export default SelectedVerses;
