import { colorProps } from "./consts";
import { getTextColor } from "./util";

interface DeleteColorModalProps {
  currentColor: colorProps | null;
  deleteColor: (colorID: string) => void;
  versesCount: number;
}

function DeleteColorModal({
  currentColor,
  deleteColor,
  versesCount,
}: DeleteColorModalProps) {
  function onClickDelete() {
    if (!currentColor) return;

    deleteColor(currentColor.colorID);
  }

  return (
    <div
      dir="ltr"
      className="modal fade modal-deletecolor"
      id="deleteColorModal"
      tabIndex={-1}
      aria-labelledby="deleteColorModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="deleteColorModal">
              Delete color confirmation
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete{" "}
              <span
                className="modal-deletecolor-label rounded"
                style={
                  currentColor
                    ? {
                        backgroundColor: currentColor.colorCode,
                        color: getTextColor(currentColor.colorCode),
                      }
                    : {}
                }
              >
                {currentColor?.colorDisplay}
              </span>{" "}
              color? All verses colored with this color will be uncolored.
            </p>
            <p>Number of verses affected: {versesCount}</p>
          </div>

          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              No, Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={onClickDelete}
            >
              Yes, delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteColorModal;
