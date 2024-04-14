import { Fragment } from "react";

import { verseMatchResult } from "@/types";

interface VerseHighlightMatchesProps {
  verse: verseMatchResult;
}

const VerseHighlightMatches = ({ verse }: VerseHighlightMatchesProps) => {
  const verseParts = verse.verseParts;

  return (
    <>
      {verseParts.map((part, i) => {
        const isHighlighted = part.isMatch;

        return (
          <Fragment key={i}>
            {isHighlighted ? <mark>{part.text}</mark> : part.text}
          </Fragment>
        );
      })}
    </>
  );
};

export default VerseHighlightMatches;
