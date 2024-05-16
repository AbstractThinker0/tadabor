import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store";

import ChaptersList from "./ChaptersList";
import AddColorModal from "./AddColorModal";
import DeleteColorModal from "./DeleteColorModal";
import EditColorsModal from "./EditColorsModal";
import ColorsList from "./ColorsList";

const ChaptersSide = () => {
  return (
    <div className="side">
      <ChaptersList />
      <div className="side-colors">
        <ColorsList />

        <div className="text-center d-flex gap-2" dir="ltr">
          <button
            className="btn btn-dark mt-1"
            data-bs-toggle="modal"
            data-bs-target="#colorsModal"
          >
            New color
          </button>
          <button
            className="btn btn-info mt-1"
            data-bs-toggle="modal"
            data-bs-target="#editColorsModal"
          >
            Edit colors
          </button>
        </div>
      </div>

      <VersesCount />

      <DeleteColorModal />
      <AddColorModal />
      <EditColorsModal />
    </div>
  );
};

const VersesCount = () => {
  const { t } = useTranslation();
  const coloringState = useAppSelector((state) => state.coloringPage);

  const getColoredVersesCount = () => {
    const asArray = Object.entries(coloringState.coloredVerses);

    const filtered = asArray.filter(([key, color]) => {
      const info = key.split("-");
      return (
        coloringState.selectedChapters[info[0]] === true &&
        coloringState.selectedColors[color.colorID]
      );
    });

    return filtered.length;
  };

  const selectedCount = getColoredVersesCount();

  if (!Object.keys(coloringState.selectedColors).length) return <></>;

  return (
    <>
      <div className="fw-bold text-success">
        {`${t("search_count")} ${selectedCount}`}
      </div>
    </>
  );
};

export default ChaptersSide;
