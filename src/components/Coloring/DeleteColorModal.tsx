import { colorProps } from "./consts";
import { getTextColor } from "./util";

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/Generic/Modal";

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
    <ModalContainer identifier="deleteColorModal">
      <ModalHeader
        identifier="deleteColorModal"
        title="Delete color confirmation"
      />
      <ModalBody>
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

export default DeleteColorModal;
