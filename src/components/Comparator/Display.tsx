import { useEffect, useRef } from "react";

import NoteText from "../NoteText";
import { IconSelect } from "@tabler/icons-react";
import useQuran from "../../context/QuranContext";
import UserTranslation from "./UserTranslation";
import { RankedVerseProps, translationsProps } from "../../types";

function htmlDecode(input: string) {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

interface DisplayProps {
  currentChapter: string;
  currentVerse: string;
  chapterVerses: RankedVerseProps[];
  transVerses: translationsProps;
  handleSelectVerse: (verseKey: string) => void;
}

const Display = ({
  currentChapter,
  currentVerse,
  chapterVerses,
  transVerses,
  handleSelectVerse,
}: DisplayProps) => {
  const { chapterNames } = useQuran();
  const refListVerses = useRef<HTMLDivElement>(null);

  const onClickVerse = (verseKey: string) => {
    const verseToSelect = currentVerse === verseKey ? "" : verseKey;
    handleSelectVerse(verseToSelect);
  };

  useEffect(() => {
    if (!refListVerses.current) return;

    if (!currentVerse) return;

    const verseToHighlight = refListVerses.current.querySelector(
      `[data-id="${currentVerse}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [currentVerse]);

  return (
    <div className="card display">
      <div className="card-header text-center text-primary fs-4">
        سورة {chapterNames[Number(currentChapter) - 1].name}
      </div>
      <div className="card-body verses" ref={refListVerses}>
        {chapterVerses.map((verse) => (
          <div
            className={`verses-item ${
              currentVerse === verse.key ? "verses-item-selected" : ""
            }`}
            key={verse.key}
          >
            <div
              dir="rtl"
              className=" py-2 border-top border-bottom fs-5"
              data-id={verse.key}
            >
              {verse.versetext}{" "}
              <span
                onClick={() => onClickVerse(verse.key)}
                className="verses-item-number"
              >
                ({verse.verseid})
              </span>{" "}
              <button
                className="btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapseExample${verse.key}`}
                aria-expanded="false"
                aria-controls={`collapseExample${verse.key}`}
              >
                <IconSelect />
              </button>
            </div>
            <NoteText verseKey={verse.key} />
            {Object.keys(transVerses).map((trans) => (
              <div className="py-2" key={trans} dir="ltr">
                <div className="text-secondary">{trans}</div>
                <div>
                  {htmlDecode(transVerses[trans][verse.rank].versetext)}
                </div>
              </div>
            ))}
            <UserTranslation verseKey={verse.key} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Display;
