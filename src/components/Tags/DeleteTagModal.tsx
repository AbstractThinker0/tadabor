import { tagProps } from "./consts";

interface DeleteTagModalProps {
  currentTag: tagProps | null;
  deleteTag: (tagID: string) => void;
  versesCount: number;
}

function DeleteTagModal({
  currentTag,
  deleteTag,
  versesCount,
}: DeleteTagModalProps) {
  function onClickDelete() {
    if (!currentTag) return;

    deleteTag(currentTag.tagID);
  }

  return (
    <div
      dir="ltr"
      className="modal fade modal-deletetag"
      id="deleteTagModal"
      tabIndex={-1}
      aria-labelledby="deleteTagModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="deleteTagModal">
              Delete tag confirmation
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
              <span className="modal-deletetag-label rounded">
                {currentTag?.tagDisplay}
              </span>{" "}
              tag? All verses tagged with this tag will lose it.
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

export default DeleteTagModal;
