import { memo, useState } from "react";
import useQuran from "../context/QuranContext";

const SelectionListRoots = memo(
  ({ isDisabled, searchString, setSearchString }) => {
    const { quranRoots } = useQuran();
    const [stateSelect, setStateSelect] = useState();

    const handleSelectRoot = (event) => {
      let rootId = event.target.value;
      setStateSelect(rootId);

      let selectedRoot = quranRoots[rootId];

      setSearchString(selectedRoot.name);
    };

    return (
      <div className="container mt-2 p-0">
        <select
          className="form-select"
          size="6"
          onChange={handleSelectRoot}
          aria-label="size 6 select example"
          disabled={isDisabled}
          value={stateSelect}
        >
          {quranRoots
            .filter((root) => root.name.startsWith(searchString) || isDisabled)
            .map((root, index) => (
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
