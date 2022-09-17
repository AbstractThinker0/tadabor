import { memo, useEffect, useMemo, useRef, useState } from "react";
import useQuran from "../context/QuranContext";

const SelectionListRoots = memo(
  ({ isDisabled, searchString, setSearchString }) => {
    const { quranRoots } = useQuran();
    const [stateSelect, setStateSelect] = useState();
    const [itemsCount, setItemsCount] = useState(100);
    const listRef = useRef();

    function handleScroll(event) {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      if (scrollHeight - scrollTop <= clientHeight + 1) {
        fetchMoreData();
      }
    }

    const handleSelectRoot = (event) => {
      let rootId = event.target.value;
      setStateSelect(rootId);

      let selectedRoot = quranRoots[rootId];

      setSearchString(selectedRoot.name);
    };

    const fetchMoreData = () => {
      setItemsCount((state) => state + 20);
    };

    let filteredArray = useMemo(
      () =>
        quranRoots.filter(
          (root) => root.name.startsWith(searchString) || isDisabled
        ),
      [quranRoots, searchString, isDisabled]
    );

    return (
      <div className="container mt-2 p-0">
        <select
          className="form-select"
          size="6"
          onChange={handleSelectRoot}
          aria-label="size 6 select example"
          disabled={isDisabled}
          value={stateSelect}
          ref={listRef}
          onScroll={handleScroll}
        >
          {filteredArray.slice(0, itemsCount).map((root, index) => (
            <option key={index} value={root.id}>
              {root.name}
            </option>
          ))}
        </select>
      </div>
    );
  },
  areEqual
);

SelectionListRoots.displayName = "SelectionListRoots";

function areEqual(prevProps, nextProps) {
  /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
  if (
    nextProps.isDisabled === true &&
    prevProps.isDisabled === nextProps.isDisabled
  ) {
    return true;
  }
}

export default SelectionListRoots;
