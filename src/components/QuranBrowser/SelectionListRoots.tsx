import { memo, useMemo, useState, Dispatch } from "react";
import useQuran from "@/context/QuranContext";
import { qbActions, qbActionsProps } from "@/components/QuranBrowser/consts";
import { rootProps } from "@/types";

interface SelectionListRootsProps {
  isDisabled: boolean;
  searchString: string;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const SelectionListRoots = memo(
  ({ isDisabled, searchString, dispatchQbAction }: SelectionListRootsProps) => {
    return (
      <div className="browser-search-roots">
        <RootsList
          isDisabled={isDisabled}
          searchString={searchString}
          dispatchQbAction={dispatchQbAction}
        />
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

interface RootsListProps {
  isDisabled: boolean;
  searchString: string;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const RootsList = ({
  isDisabled,
  searchString,
  dispatchQbAction,
}: RootsListProps) => {
  const { quranRoots } = useQuran();
  const [itemsCount, setItemsCount] = useState(50);

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setItemsCount((prevState) => prevState + 20);
    }
  }

  const filteredArray = useMemo(
    () =>
      quranRoots.filter(
        (root) => root.name.startsWith(searchString) || isDisabled
      ),
    [searchString, isDisabled]
  );

  function handleRootSelect(rootName: string) {
    if (isDisabled) return;

    dispatchQbAction(qbActions.setSearchString(rootName));
  }

  return (
    <div
      className={`browser-search-roots-list ${
        isDisabled ? "browser-search-roots-list-disabled" : ""
      }`}
      onScroll={handleScroll}
    >
      {filteredArray.slice(0, itemsCount).map((root) => (
        <RootItem
          root={root}
          isSelected={searchString === root.name && !isDisabled}
          handleRootSelect={handleRootSelect}
        />
      ))}
    </div>
  );
};

interface RootItemProps {
  root: rootProps;
  isSelected: boolean;
  handleRootSelect: (rootName: string) => void;
}

const RootItem = ({ root, isSelected, handleRootSelect }: RootItemProps) => {
  function onClickRoot(rootName: string) {
    handleRootSelect(rootName);
  }

  return (
    <div
      onClick={() => onClickRoot(root.name)}
      className={`browser-search-roots-list-item ${
        isSelected ? "browser-search-roots-list-item-selected" : ""
      }`}
      key={root.id}
    >
      {root.name}
    </div>
  );
};

export default SelectionListRoots;
