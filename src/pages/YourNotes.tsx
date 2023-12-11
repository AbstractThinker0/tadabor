import { useTranslation } from "react-i18next";

import RootNotes from "@/components/YourNotes/RootNotes";
import VerseNotes from "@/components/YourNotes/VerseNotes";

function YourNotes() {
  const { t } = useTranslation();

  return (
    <div className="yournotes p-2">
      <ul
        className="nav nav-tabs justify-content-center"
        id="myTab"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="verses-tab"
            data-bs-toggle="tab"
            data-bs-target="#verses-tab-pane"
            type="button"
            role="tab"
            aria-controls="verses-tab-pane"
            aria-selected="true"
          >
            {t("notes_verses")}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="roots-tab"
            data-bs-toggle="tab"
            data-bs-target="#roots-tab-pane"
            type="button"
            role="tab"
            aria-controls="roots-tab-pane"
            aria-selected="false"
          >
            {t("notes_roots")}
          </button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="verses-tab-pane"
          role="tabpanel"
          aria-labelledby="verses-tab"
          tabIndex={0}
        >
          <VerseNotes />
        </div>
        <div
          className="tab-pane fade"
          id="roots-tab-pane"
          role="tabpanel"
          aria-labelledby="roots-tab"
          tabIndex={0}
        >
          <RootNotes />
        </div>
      </div>
    </div>
  );
}

export default YourNotes;
