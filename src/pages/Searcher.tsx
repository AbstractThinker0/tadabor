import SearcherDisplay from "@/components/Searcher/SearcherDisplay";
import SearcherSide from "@/components/Searcher/SearcherSide";

const Searcher = () => {
  return (
    <div className="searcher">
      <SearcherSide />
      <SearcherDisplay />
    </div>
  );
};

export default Searcher;
