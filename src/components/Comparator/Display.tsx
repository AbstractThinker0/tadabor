import { useEffect, useRef, useState, useTransition } from "react";
import { IconSelect } from "@tabler/icons-react";

import useQuran from "@/context/useQuran";
import { RankedVerseProps, translationsProps } from "@/types";

import NoteText from "@/components/NoteText";
import LoadingSpinner from "@/components/LoadingSpinner";

import UserTranslation from "./UserTranslation";

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
  const [stateVerses, setStateVerses] = useState<RankedVerseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setStateVerses(chapterVerses);
    });
  }, [chapterVerses]);

  const quranService = useQuran();
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
      <TransAlert />
      <div className="card-header text-center text-primary fs-3">
        سورة {quranService.getChapterName(currentChapter)}
      </div>
      <div className="card-body verses" ref={refListVerses}>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          stateVerses.map((verse) => (
            <div
              className={`verses-item ${
                currentVerse === verse.key ? "verses-item-selected" : ""
              }`}
              key={verse.key}
            >
              <div
                dir="rtl"
                className=" py-2 border-top border-bottom fs-3"
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
                  <div>{transVerses[trans][verse.rank].versetext}</div>
                </div>
              ))}
              <UserTranslation verseKey={verse.key} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const TransAlert = () => {
  const localStorageTransKey = "transNotified";

  const [transNotified, setTransNotified] = useState(
    localStorage.getItem(localStorageTransKey) !== null
  );

  function onClickCloseAlert() {
    localStorage.setItem(localStorageTransKey, "true");
    setTransNotified(true);
  }

  return (
    <>
      {!transNotified && (
        <div
          className="alert alert-info alert-dismissible fade show"
          role="alert"
          dir="auto"
        >
          <strong>Note:</strong> Translations may not always fully capture the
          original meaning of the text. They are sincere attempts by their
          authors to comprehend the text based on their abilities and knowledge.
          Additionally, the accuracy of the translated version is inevitably
          influenced by semantic changes made to the original text prior to
          translation.
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={onClickCloseAlert}
          ></button>
        </div>
      )}
    </>
  );
};

export default Display;
