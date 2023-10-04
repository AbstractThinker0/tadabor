import { Dispatch, SetStateAction, useState } from "react";

import useQuran from "@/context/QuranContext";

interface ChaptersListProps {
  currentChapter: number;
  handleSelectedChapters: (selectedChapters: string[]) => void;
  handleCurrentChapter: (chapterID: number) => void;
}

const ChaptersList = ({ currentChapter }: ChaptersListProps) => {
  const [searchToken, setSearchToken] = useState("");

  const { chapterNames } = useQuran();

  return (
    <div>
      <ChapterInput searchToken={searchToken} setSearchToken={setSearchToken} />
    </div>
  );
};

interface ChapterInputProps {
  searchToken: string;
  setSearchToken: Dispatch<SetStateAction<string>>;
}

const ChapterInput = ({ searchToken, setSearchToken }: ChapterInputProps) => {
  //
  const onChangeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchToken(event.target.value);
  };

  return (
    <div>
      <input type="search" value={searchToken} onChange={onChangeToken} />
      <div></div>
    </div>
  );
};

ChaptersList.displayName = "ChaptersList";

export default ChaptersList;
