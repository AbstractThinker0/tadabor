import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store";

import ChaptersList from "@/components/Pages/Coloring/ChaptersList";
import AddColorModal from "@/components/Pages/Coloring/AddColorModal";
import DeleteColorModal from "@/components/Pages/Coloring/DeleteColorModal";
import EditColorsModal from "@/components/Pages/Coloring/EditColorsModal";
import ColorsList from "@/components/Pages/Coloring/ColorsList";

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
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );
  const selectedChapters = useAppSelector(
    (state) => state.coloringPage.selectedChapters
  );
  const selectedColors = useAppSelector(
    (state) => state.coloringPage.selectedColors
  );

  const getColoredVersesCount = () => {
    const asArray = Object.entries(coloredVerses);

    const filtered = asArray.filter(([key, color]) => {
      const info = key.split("-");
      return (
        selectedChapters[info[0]] === true && selectedColors[color.colorID]
      );
    });

    return filtered.length;
  };

  const selectedCount = getColoredVersesCount();

  if (!Object.keys(selectedColors).length) return <></>;

  return (
    <>
      <div className="fw-bold text-success">
        {`${t("search_count")} ${selectedCount}`}
      </div>
    </>
  );
};

export default ChaptersSide;
