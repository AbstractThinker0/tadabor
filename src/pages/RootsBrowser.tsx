import { useState } from "react";

import SearchForm from "@/components/RootsBrowser/SearchForm";
import RootsList from "@/components/RootsBrowser/RootsList";

function RootsBrowser() {
  const [searchString, setSearchString] = useState("");
  const [searchInclusive, setSearchInclusive] = useState(false);

  return (
    <div className="roots">
      <SearchForm
        searchString={searchString}
        searchInclusive={searchInclusive}
        setSearchString={setSearchString}
        setSearchInclusive={setSearchInclusive}
      />

      <RootsList
        searchString={searchString}
        searchInclusive={searchInclusive}
      />
    </div>
  );
}

export default RootsBrowser;
