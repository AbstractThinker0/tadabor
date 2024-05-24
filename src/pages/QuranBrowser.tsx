import SearchPanel from "@/components/Pages/QuranBrowser/SearchPanel";
import DisplayPanel from "@/components/Pages/QuranBrowser/DisplayPanel";

import "@/styles/pages/browser.scss";

function QuranBrowser() {
  return (
    <div className="browser">
      <SearchPanel />
      <DisplayPanel />
    </div>
  );
}

export default QuranBrowser;
