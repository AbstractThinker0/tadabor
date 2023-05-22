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

    function onClickSelect(
      event: React.MouseEvent<HTMLSelectElement, MouseEvent>
    ) {
      handleSelectionListChapters(
        Array.from(
          event.currentTarget.selectedOptions,
          (option) => option.value
        ),
        event.currentTarget.value
      );
    }

    function onChangeSelect(event: React.ChangeEvent<HTMLSelectElement>) {
      handleSelectionListChapters(
        Array.from(event.target.selectedOptions, (option) => option.value),
        event.target.value
      );
    }

    return (
      <div className="container mt-2 mb-2 p-0 browser-search-chapter">
        <input
          className="form-control browser-search-chapter-input"
          type="search"
          value={chapterSearch}
          onChange={onChangeInput}
          placeholder=""
          aria-label="Search"
          dir="rtl"
        />
        <select
          className="form-select browser-search-chapter-list"
          size={7}
          onClick={onClickSelect}
          onChange={onChangeSelect}
          aria-label="size 7 select example"
          value={selectedChapters}
          multiple
        >
          {chapterNames
            .filter((chapter) => chapter.name.includes(chapterSearch))
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
