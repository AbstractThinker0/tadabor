import { memo, useMemo, useState } from "react";
import useQuran from "../../context/QuranContext";
import { useQuranBrowser } from "../../pages/QuranBrowser";
import { qbActions } from "./consts";

interface SelectionListRootsProps {
  isDisabled: boolean;
  searchString: string;
}

const SelectionListRoots = memo(
  ({ isDisabled, searchString }: SelectionListRootsProps) => {
    const { quranRoots } = useQuran();
    const dispatchAction = useQuranBrowser();

    const [stateSelect, setStateSelect] = useState<string>();
    const [itemsCount, setItemsCount] = useState(100);

    function handleScroll(event: React.UIEvent<HTMLSelectElement>) {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      // Reached the bottom, ( the +1 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
      if (scrollHeight - scrollTop <= clientHeight + 1) {
        fetchMoreData();
      }
    }

    const handleSelectRoot = (event: React.ChangeEvent<HTMLSelectElement>) => {
      let rootId = event.currentTarget.value;
      setStateSelect(rootId);

      let selectedRoot = quranRoots[Number(rootId)];

      dispatchAction(qbActions.setSearchString(selectedRoot.name));
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
          size={6}
          onChange={handleSelectRoot}
          aria-label="size 6 select"
          disabled={isDisabled}
          value={stateSelect}
          onScroll={handleScroll}
        >
          {filteredArray.slice(0, itemsCount).map((root, index: number) => (
            <option key={index} value={root.id}>
              {root.name}
            </option>
          ))}
        </select>
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (
      nextProps.isDisabled === true &&
      prevProps.isDisabled === nextProps.isDisabled
    ) {
      return true;
    }
    return false;
  }
);

SelectionListRoots.displayName = "SelectionListRoots";

export default SelectionListRoots;
