import { useState } from "react";

import SelectionListChapters from "@/components/Translation/SelectionListChapters";
import DisplayPanel from "@/components/Translation/DisplayPanel";

const Translation = () => {
  const [selectChapter, setSelectChapter] = useState(1);

  const handleChapterChange = (chapter: number) => {
    setSelectChapter(chapter);
  };

  return (
    <div className="translation">
      <SelectionListChapters
        handleChapterChange={handleChapterChange}
        selectChapter={selectChapter}
      />
      <DisplayPanel selectChapter={selectChapter} />
    </div>
  );
};

export default Translation;
