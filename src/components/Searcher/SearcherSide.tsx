import { useEffect, useState, useTransition } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { searcherPageActions } from "@/store/slices/searcherPage";

import useQuran from "@/context/QuranContext";
import { rootProps } from "@/types";
import { hasAllLetters, normalizeAlif } from "@/util/util";
import LoadingSpinner from "@/components/LoadingSpinner";

const SearcherSide = () => {
  const [searchToken, setSearchToken] = useState("");

  const onChangeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchToken(event.target.value);
  };

  return (
    <div className="searcher-side d-flex flex-column">
      <div>
        <input
          className="form-control"
          type="search"
          placeholder=""
          value={searchToken}
          aria-label="Search"
          onChange={onChangeToken}
          required
          dir="rtl"
        />
      </div>
      <RootsList searchString={searchToken} />
    </div>
  );
};

interface RootsListProps {
  searchString: string;
}

const RootsList = ({ searchString }: RootsListProps) => {
  const quranService = useQuran();

  const [isPending, startTransition] = useTransition();

  const [itemsCount, setItemsCount] = useState(80);

  const [stateRoots, setStateRoots] = useState<rootProps[]>([]);

  const { search_roots } = useAppSelector((state) => state.searcherPage);

  useEffect(() => {
    startTransition(() => {
      setStateRoots(
        quranService.quranRoots.filter(
          (root) =>
            normalizeAlif(root.name).startsWith(searchString) ||
            root.name.startsWith(searchString) ||
            !searchString ||
            hasAllLetters(root.name, searchString)
        )
      );
    });
  }, [searchString]);

  const fetchMoreData = () => {
    setItemsCount((state) => state + 15);
  };

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      fetchMoreData();
    }
  }

  return (
    <div className="searcher-side-roots" onScroll={handleScroll}>
      {isPending ? (
        <LoadingSpinner />
      ) : (
        stateRoots
          .slice(0, itemsCount)
          .map((root) => (
            <RootItem
              key={root.id}
              root={root}
              isSelected={search_roots[root.id] ? true : false}
            />
          ))
      )}
    </div>
  );
};

interface RootItemProps {
  root: rootProps;
  isSelected: boolean;
}

const RootItem = ({ root, isSelected }: RootItemProps) => {
  const dispatch = useAppDispatch();

  const itemClass = isSelected ? "searcher-side-roots-item-selected" : "";

  const onClickRoot = (root: rootProps) => {
    if (isSelected) {
      dispatch(searcherPageActions.deleteRoot({ root_id: root.id.toString() }));
    } else {
      dispatch(searcherPageActions.addRoot({ root }));
    }
  };

  return (
    <div
      className={"searcher-side-roots-item ".concat(itemClass)}
      onClick={() => onClickRoot(root)}
    >
      {root.name}
    </div>
  );
};

export default SearcherSide;
