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
        <DeleteColorModal />
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
        <AddColorModal />
        <EditColorsModal />
      </div>
    </div>
  );
};

export default ChaptersSide;
