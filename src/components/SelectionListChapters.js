import { memo, useState } from "react";
import useQuran from "../context/QuranContext";

const SelectionListChapters = memo(
  ({ handleSelectionListChapters, innerRef, selectedChapters }) => {
    const { chapterNames } = useQuran();
    const [chapterSearch, setChapterSearch] = useState("");

    const onChangeInput = (event) => {
      setChapterSearch(event.target.value);
    };

    return (
      <div className="container mt-2 mb-2 p-0">
        <input
          className="form-control"
          type="search"
          value={chapterSearch}
          onChange={onChangeInput}
          placeholder=""
          aria-label="Search"
          dir="rtl"
        />
        <select
          className="form-select"
          size="7"
          onFocus={handleSelectionListChapters}
          onChange={handleSelectionListChapters}
          aria-label="size 7 select example"
          ref={innerRef}
          value={selectedChapters}
          multiple
        >
          {chapterNames
            .filter((chapter) => chapter.name.startsWith(chapterSearch))
            .map((chapter, index) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.id}. {chapter.name}
              </option>
            ))}
        </select>
      </div>
    );
  }
);

SelectionListChapters.displayName = "SelectionListChapters";

export default SelectionListChapters;
