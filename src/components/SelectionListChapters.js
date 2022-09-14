import { memo } from "react";
import useQuran from "../context/QuranContext";

const SelectionListChapters = memo(
  ({ handleSelectionListChapters, innerRef, selectedChapters }) => {
    const { chapterNames } = useQuran();
    return (
      <div className="container mt-2 mb-2 p-0">
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
          {chapterNames.map((chapter, index) => (
            <option key={chapter.id} value={chapter.id}>
              {index + 1}. {chapter.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

SelectionListChapters.displayName = "SelectionListChapters";

export default SelectionListChapters;
