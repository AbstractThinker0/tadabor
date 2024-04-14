import { useState, useEffect } from "react";

import {
  isRootNotesLoading,
  isVerseNotesLoading,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import { fetchRootNotes } from "@/store/slices/rootNotes";
import { fetchVerseNotes } from "@/store/slices/verseNotes";

import SearchForm from "@/components/RootsBrowser/SearchForm";
import RootsList from "@/components/RootsBrowser/RootsList";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

function RootsBrowser() {
  const dispatch = useAppDispatch();
  const isRNotesLoading = useAppSelector(isRootNotesLoading());
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  const [searchString, setSearchString] = useState("");
  const [searchInclusive, setSearchInclusive] = useState(false);

  useEffect(() => {
    dispatch(fetchRootNotes());
    dispatch(fetchVerseNotes());
  }, []);

  return (
    <div className="roots">
      <SearchForm
        searchString={searchString}
        searchInclusive={searchInclusive}
        setSearchString={setSearchString}
        setSearchInclusive={setSearchInclusive}
      />

      {isRNotesLoading || isVNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <RootsList
          searchString={searchString}
          searchInclusive={searchInclusive}
        />
      )}
    </div>
  );
}

export default RootsBrowser;
