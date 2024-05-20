import { useEffect, useState, useTransition } from "react";

import { verseMatchResult, verseProps } from "@/types";
import { getDerivationsInVerse } from "@/util/util";

import useQuran from "@/context/useQuran";
import { useAppDispatch, useAppSelector } from "@/store";
import { searcherPageActions } from "@/store/slices/pages/searcher";

import { ExpandButton } from "@/components/Generic/Buttons";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import NoteText from "@/components/Custom/NoteText";
import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

const SearcherDisplay = () => {
  const { search_roots } = useAppSelector((state) => state.searcherPage);

  const rootsArray = Object.keys(search_roots);

  return (
    <div className="searcher-display" dir="rtl">
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

  const dispatch = useAppDispatch();
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
      const rootTarget = quranService.getRootByID(root_id);

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
      const sortedVerses = matchVerses.sort((verseA, verseB) => {
        const infoA = verseA.key.split("-");
        const infoB = verseB.key.split("-");
        if (Number(infoA[0]) !== Number(infoB[0]))
          return Number(infoA[0]) - Number(infoB[0]);
        else return Number(infoA[1]) - Number(infoB[1]);
      });

      setStateVerses(sortedVerses);
      dispatch(searcherPageActions.setVersesCount(sortedVerses.length));
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
  const dispatch = useAppDispatch();

  const onClickVerse = () => {
    dispatch(searcherPageActions.setVerseTab(verseMatch.key));
  };

  return (
    <VerseContainer>
      <VerseHighlightMatches verse={verseMatch} />{" "}
      <span
        className="searcher-display-verses-item-suffix"
        onClick={onClickVerse}
      >{`(${quranService.getChapterName(verseMatch.suraid)}:${
        verseMatch.verseid
      })`}</span>
      <ExpandButton identifier={verseMatch.key} />
    </VerseContainer>
  );
};

export default SearcherDisplay;
