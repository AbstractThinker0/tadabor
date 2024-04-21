import { tagProps } from "./consts";

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/Generic/Modal";

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
    <ModalContainer identifier="deleteTagModal">
      <ModalHeader
        identifier="deleteTagModal"
        title="Delete tag confirmation"
      />
      <ModalBody>
        <p>
          Are you sure you want to delete{" "}
          <span className="modal-deletetag-label rounded">
            {currentTag?.tagDisplay}
          </span>{" "}
          tag? All verses tagged with this tag will lose it.
        </p>
        <p>Number of verses affected: {versesCount}</p>
      </ModalBody>
      <ModalFooter>
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
      </ModalFooter>
    </ModalContainer>
  );
}

export default DeleteTagModal;
