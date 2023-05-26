import { Fragment, useEffect, useRef, useState } from "react";
import useQuran from "../context/QuranContext";
import { rootProps } from "../types";
import { Collapse } from "bootstrap";
import NoteText from "../components/NoteText";
import { IconSelect } from "@tabler/icons-react";
import { splitByArray } from "../util/util";

interface RankedVerseProps {
  key: string;
  suraid: string;
  verseid: string;
  versetext: string;
  rank: number;
}

function Inspector() {
  const { chapterNames, absoluteQuran } = useQuran();
  const [currentChapter, setCurrentChapter] = useState(1);

  const chapterVerses: RankedVerseProps[] = [];

  absoluteQuran.forEach((verse, index) => {
    if (verse.suraid !== currentChapter.toString()) return;

    chapterVerses.push({ ...verse, rank: index });
  });

  return (
    <div className="inspector">
      <div className="p-2 display">
        <h4 className="text-center">{chapterNames[currentChapter - 1].name}</h4>
        <div className="card p-2 display-verses">
          <div className="card-body">
            {chapterVerses.map((verse) => (
              <div className="display-verses-item" key={verse.key}>
                <VerseWords
                  verseRank={verse.rank}
                  verseText={verse.versetext.split(" ")}
                  verseID={verse.verseid}
                  verseKey={verse.key}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface VerseWordsProps {
  verseRank: number;
  verseText: string[];
  verseID: string;
  verseKey: string;
}

const VerseWords = ({
  verseText,
  verseRank,
  verseID,
  verseKey,
}: VerseWordsProps) => {
  const { quranRoots } = useQuran();
  const [currentRoots, setCurrentRoots] = useState<rootProps[]>([]);
  const [selectedWord, setSelectedWord] = useState(-1);
  const refCollapsible = useRef<HTMLDivElement>(null);
  const refCollapse = useRef<Collapse>();
  const refCurrentWord = useRef<Number>();

  useEffect(() => {
    if (refCollapsible.current) {
      refCollapse.current = new Collapse(refCollapsible.current, {
        toggle: false,
      });
    }
  }, []);

  // "119:2,10",

  function onClickWord(index: number) {
    const wordRoots = quranRoots.filter((root) =>
      root.occurences.find((occ) => {
        const rootData = occ.split(":");

        if (rootData[0] !== verseRank.toString()) return false;

        const wordIndexes = rootData[1].split(",");

        return wordIndexes.includes(index.toString());
      })
    );

    setCurrentRoots(wordRoots);

    if (selectedWord === index - 1) {
      setSelectedWord(-1);
    } else {
      setSelectedWord(index - 1);
    }

    if (refCollapse.current) {
      if (refCurrentWord.current === index) {
        refCollapse.current.hide();
        refCurrentWord.current = -1;
      } else {
        refCollapse.current.show();
        refCurrentWord.current = index;
      }
    }
  }

  return (
    <>
      <div className="display-verses-item-text">
        {verseText.map((word, index) => (
          <Fragment key={index}>
            <span
              onClick={() => onClickWord(index + 1)}
              className={`display-verses-item-text-word ${
                selectedWord === index
                  ? "display-verses-item-text-word-selected"
                  : ""
              }`}
            >
              {word}
            </span>{" "}
          </Fragment>
        ))}{" "}
        {`(${verseID})`}{" "}
        <button
          className="btn"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapseExample${verseKey}`}
          aria-expanded="false"
          aria-controls={`collapseExample${verseKey}`}
        >
          <IconSelect />
        </button>
      </div>
      <NoteText verseKey={verseKey} />
      <div
        ref={refCollapsible}
        className="collapse"
        id={`collapseExample${verseRank}`}
      >
        <div className="card card-body">
          <div
            className="accordion display-verses-item-roots"
            id="accordionPanelsStayOpenExample"
          >
            {currentRoots.map((root) => (
              <div className="accordion-item" key={root.id}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#panelsStayOpen-${root.id}`}
                    aria-expanded="false"
                    aria-controls={`panelsStayOpen-${root.id}`}
                  >
                    {root.name}
                  </button>
                </h2>
                <RootOccurences rootID={root.id} rootOccs={root.occurences} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

interface RootOccurencesProps {
  rootID: number;
  rootOccs: string[];
}

const RootOccurences = ({ rootID, rootOccs }: RootOccurencesProps) => {
  const [isShown, setIsShown] = useState(false);
  const [itemsCount, setItemsCount] = useState(20);
  const refCollapse = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const collapseElement = refCollapse.current;
    function onShowRoots(event: Event) {
      setIsShown(true);
    }

    function onHiddenRoots(event: Event) {
      setIsShown(false);
    }

    if (collapseElement !== null) {
      collapseElement.addEventListener("show.bs.collapse", onShowRoots);
      collapseElement.addEventListener("hidden.bs.collapse", onHiddenRoots);
    }

    return () => {
      if (collapseElement !== null) {
        collapseElement.removeEventListener("show.bs.collapse", onShowRoots);
        collapseElement.removeEventListener(
          "hidden.bs.collapse",
          onHiddenRoots
        );
      }
    };
  }, []);

  function onScrollOccs(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setItemsCount((state) => state + 10);
    }
  }

  return (
    <div
      ref={refCollapse}
      id={`panelsStayOpen-${rootID}`}
      className="accordion-collapse collapse"
    >
      {isShown && (
        <div
          className="accordion-body display-verses-item-roots-verses"
          onScroll={onScrollOccs}
        >
          {rootOccs.slice(0, itemsCount).map((occ, index) => (
            <div key={index} className="display-verses-item-roots-verses-item">
              <RootVerse occurence={occ} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface RootVerseProps {
  occurence: string;
}

const RootVerse = ({ occurence }: RootVerseProps) => {
  const { chapterNames, absoluteQuran } = useQuran();

  const occData = occurence.split(":");
  const verse = absoluteQuran[Number(occData[0])];
  const verseWords = verse.versetext.split(" ");
  const wordIndexes = occData[1].split(",");
  const derivationsArray = wordIndexes.map(
    (index) => verseWords[Number(index) - 1]
  );
  const rootParts = splitByArray(verse.versetext, derivationsArray);

  const verseParts = rootParts.filter(Boolean).map((part) => ({
    text: part,
    highlight: derivationsArray.includes(part),
  }));

  const verseChapter = chapterNames[Number(verse.suraid) - 1].name;
  return (
    <>
      <div>
        <span className="display-verses-item-roots-verses-item-text">
          {verseParts.map((part, i) => (
            <Fragment key={i}>
              {part.highlight ? <mark>{part.text}</mark> : part.text}
            </Fragment>
          ))}{" "}
          {` (${verseChapter}:${verse.verseid}) `}
        </span>
        <button
          className="btn"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapseExample${verse.key}-`}
          aria-expanded="false"
          aria-controls={`collapseExample${verse.key}-`}
        >
          <IconSelect />
        </button>
      </div>
      <NoteText verseKey={verse.key} targetID={`${verse.key}-`} />
    </>
  );
};

export default Inspector;
