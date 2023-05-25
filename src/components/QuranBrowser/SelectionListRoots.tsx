import { memo, useMemo, useState, Dispatch } from "react";
import useQuran from "../../context/QuranContext";
import { qbActions, qbActionsProps } from "./consts";

interface SelectionListRootsProps {
  isDisabled: boolean;
  searchString: string;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const SelectionListRoots = memo(
  ({ isDisabled, searchString, dispatchQbAction }: SelectionListRootsProps) => {
    const { quranRoots } = useQuran();

    const [stateSelect, setStateSelect] = useState<string>();
    const [itemsCount, setItemsCount] = useState(100);

    function handleScroll(event: React.UIEvent<HTMLSelectElement>) {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      // Reached the bottom, ( the +1 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
      if (scrollHeight - scrollTop <= clientHeight + 1) {
        fetchMoreData();
      }
    }

    const onClickSelect = (event: React.MouseEvent<HTMLSelectElement>) => {
      handleSelectRoot(event.currentTarget.value);
    };

    const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
      handleSelectRoot(event.currentTarget.value);
    };

    const handleSelectRoot = (rootID: string) => {
      setStateSelect(rootID);

      const selectedRoot = quranRoots[Number(rootID)];

      dispatchQbAction(qbActions.setSearchString(selectedRoot.name));
    };

    const fetchMoreData = () => {
      setItemsCount((state) => state + 20);
    };

    const filteredArray = useMemo(
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
          onClick={onClickSelect}
          onChange={onChangeSelect}
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
