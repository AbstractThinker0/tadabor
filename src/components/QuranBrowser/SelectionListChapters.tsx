import { memo, useState } from "react";
import useQuran from "../../context/QuranContext";

interface SelectionListChaptersProps {
  handleSelectionListChapters: (options: string[], chapter: string) => void;
  selectedChapters: string[];
}

const SelectionListChapters = memo(
  ({
    handleSelectionListChapters,
    selectedChapters,
  }: SelectionListChaptersProps) => {
    const { chapterNames } = useQuran();
    const [chapterSearch, setChapterSearch] = useState("");

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChapterSearch(event.target.value);
    };

    function onFocusSelect(
      event: React.FocusEvent<HTMLSelectElement, Element>
    ) {
      handleSelectionListChapters(
        Array.from(event.target.selectedOptions, (option) => option.value),
        event.target.value
      );
    }

    function onChangeSelect(event: React.ChangeEvent<HTMLSelectElement>) {
      handleSelectionListChapters(
        Array.from(event.target.selectedOptions, (option) => option.value),
        event.target.value
      );
    }

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
          size={7}
          onFocus={onFocusSelect}
          onChange={onChangeSelect}
          aria-label="size 7 select example"
          value={selectedChapters}
          multiple
        >
          {chapterNames
            .filter((chapter) => chapter.name.startsWith(chapterSearch))
            .map((chapter) => (
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
