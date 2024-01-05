import { useEffect, useState, useTransition } from "react";
import { IconSelect } from "@tabler/icons-react";

import { verseMatchResult, verseProps } from "@/types";
import { getDerivationsInVerse } from "@/util/util";

import useQuran from "@/context/useQuran";
import { useAppDispatch, useAppSelector } from "@/store";
import { searcherPageActions } from "@/store/slices/searcherPage";

import NoteText from "@/components/NoteText";
import LoadingSpinner from "@/components/LoadingSpinner";

const SearcherDisplay = () => {
  const { search_roots } = useAppSelector((state) => state.searcherPage);

  const rootsArray = Object.keys(search_roots);

  return (
    <div className="searcher-display">
      <div className="searcher-display-roots">
        {rootsArray.map((root_id) => (
          <RootItem
            key={root_id}
            root_name={search_roots[root_id].name}
            root_id={root_id}
          />
        ))}
      </div>
      <div className="searcher-display-verses">
        <VersesList />
      </div>
    </div>
  );
};

interface RootItemProps {
  root_name: string;
  root_id: string;
}

const RootItem = ({ root_name, root_id }: RootItemProps) => {
  const dispatch = useAppDispatch();

  const onClickRemove = (root_id: string) => {
    dispatch(searcherPageActions.deleteRoot({ root_id: root_id }));
  };

  return (
    <div className="searcher-display-roots-item">
      <span className="searcher-display-roots-item-text">{root_name}</span>
      <span
        className="searcher-display-roots-item-delete"
        onClick={() => onClickRemove(root_id)}
      >
        ❌
      </span>
    </div>
  );
};

const VersesList = () => {
  const { search_roots } = useAppSelector((state) => state.searcherPage);
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseMatchResult[]>([]);

  const [isPending, startTransition] = useTransition();

  interface verseProtoType {
    verse: verseProps;
    wordIndexes: string[];
  }

  interface versesObjectType {
    [key: string]: verseProtoType;
  }

  useEffect(() => {
    //
    const matchVerses: verseMatchResult[] = [];
    const rootsArray = Object.keys(search_roots);
    const versesObject: versesObjectType = {};

    rootsArray.forEach((root_id) => {
      const rootTarget = quranService.quranRoots.find(
        (root) => root.id === Number(root_id)
      );

      if (!rootTarget) return;

      rootTarget.occurences.forEach((item) => {
        const info = item.split(":");

        // between 0 .. 6235
        const verseRank = info[0];

        const currentVerse = quranService.getVerseByRank(verseRank);

        const wordIndexes = info[1].split(",");

        if (versesObject[currentVerse.key]) {
          versesObject[currentVerse.key].wordIndexes = Array.from(
            new Set([
              ...versesObject[currentVerse.key].wordIndexes,
              ...wordIndexes,
            ])
          );
        } else {
          versesObject[currentVerse.key] = {
            verse: currentVerse,
            wordIndexes: wordIndexes,
          };
        }
      });
    });

    Object.keys(versesObject).forEach((verseKey) => {
      const currentVerse = versesObject[verseKey].verse;
      const chapterName = quranService.getChapterName(currentVerse.suraid);

      const { verseResult } = getDerivationsInVerse(
        versesObject[verseKey].wordIndexes,
        currentVerse,
        chapterName
      );

      matchVerses.push(verseResult);
    });

    startTransition(() => {
      setStateVerses(
        matchVerses.sort((verseA, verseB) => {
          const infoA = verseA.key.split("-");
          const infoB = verseB.key.split("-");
          if (Number(infoA[0]) !== Number(infoB[0]))
            return Number(infoA[0]) - Number(infoB[0]);
          else return Number(infoA[1]) - Number(infoB[1]);
        })
      );
    });
  }, [search_roots]);

  if (isPending) return <LoadingSpinner />;

  return (
    <>
      {stateVerses.map((verseMatch, index) => (
        <div key={index} className="searcher-display-verses-item">
          <VerseComponent verseMatch={verseMatch} />
          <NoteText verseKey={verseMatch.key} />
        </div>
      ))}
    </>
  );
};

interface VerseComponentProps {
  verseMatch: verseMatchResult;
}

const VerseComponent = ({ verseMatch }: VerseComponentProps) => {
  const quranService = useQuran();

  return (
    <div>
      {verseMatch.verseParts.map((part, i) => {
        const isHighlighted = part.isMatch;

        return (
          <span key={i}>
            {isHighlighted ? <mark>{part.text}</mark> : part.text}{" "}
          </span>
        );
      })}
      {`(${quranService.getChapterName(verseMatch.suraid)}:${
        verseMatch.verseid
      })`}
      <button
        className="btn"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={"#collapseExample" + verseMatch.key}
        aria-expanded="false"
        aria-controls={"collapseExample" + verseMatch.key}
      >
        <IconSelect />
      </button>
    </div>
  );
};

export default SearcherDisplay;
