import { useEffect, useRef, useState } from "react";
import useQuran from "../context/QuranContext";
import { rootProps } from "../types";
import { Collapse } from "bootstrap";

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
        <div className="card p-2">
          <div className="card-body display-verses">
            {chapterVerses.map((verse) => (
              <div key={verse.key}>
                <VerseWords
                  verseRank={verse.rank}
                  verseText={verse.versetext.split(" ")}
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
}

const VerseWords = ({ verseText, verseRank }: VerseWordsProps) => {
  const { quranRoots } = useQuran();
  const [currentRoots, setCurrentRoots] = useState<rootProps[]>([]);
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
    console.log(`${verseRank}:${index}`);

    const wordRoots = quranRoots.filter((root) =>
      root.occurences.find((occ) => {
        const rootData = occ.split(":");

        if (rootData[0] !== verseRank.toString()) return false;

        const wordIndexes = rootData[1].split(",");

        return wordIndexes.includes(index.toString());
      })
    );

    setCurrentRoots(wordRoots);

    if (wordRoots) {
      console.log(wordRoots);
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
      <div className="display-verses-item">
        {verseText.map((word, index) => (
          <span key={index} onClick={() => onClickWord(index + 1)}>
            {word}{" "}
          </span>
        ))}
      </div>
      <div
        ref={refCollapsible}
        className="collapse"
        id={`collapseExample${verseRank}`}
      >
        <div className="card card-body">
          <div className="accordion" id="accordionPanelsStayOpenExample">
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
                <div
                  id={`panelsStayOpen-${root.id}`}
                  className="accordion-collapse collapse"
                >
                  <div className="accordion-body">
                    {root.occurences.map((occ, index) => (
                      <div key={index}>
                        <RootVerse occurence={occ} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

interface RootVerseProps {
  occurence: string;
}

const RootVerse = ({ occurence }: RootVerseProps) => {
  const { chapterNames, absoluteQuran } = useQuran();

  const occData = occurence.split(":");
  const verse = absoluteQuran[Number(occData[0])];
  return <>{verse.versetext}</>;
};

export default Inspector;
