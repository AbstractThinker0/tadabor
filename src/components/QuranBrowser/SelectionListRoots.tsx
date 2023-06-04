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
    const [itemsCount, setItemsCount] = useState(100);

    function handleScroll(event: React.UIEvent<HTMLDivElement>) {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      // Reached the bottom, ( the +1 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
      if (scrollHeight - scrollTop <= clientHeight + 10) {
        fetchMoreData();
      }
    }

    function onClickRoot(rootID: string) {
      if (isDisabled) return;

      const selectedRoot = quranRoots[Number(rootID)];

      dispatchQbAction(qbActions.setSearchString(selectedRoot.name));
    }

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
      <div className="container browser-search-roots mt-2 p-0">
        <div
          className={`browser-search-roots-list ${
            isDisabled ? "browser-search-roots-list-disabled" : ""
          }`}
          onScroll={handleScroll}
        >
          {filteredArray.slice(0, itemsCount).map((root, index: number) => (
            <div
              onClick={() => onClickRoot(root.id.toString())}
              className={`browser-search-roots-list-item ${
                searchString === root.name && !isDisabled
                  ? "browser-search-roots-list-item-selected"
                  : ""
              }`}
              key={root.id}
            >
              {root.name}
            </div>
          ))}
        </div>
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
