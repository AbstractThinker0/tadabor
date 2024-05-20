import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { dbFuncs } from "@/util/db";

import { getTextColor } from "@/components/Pages/Coloring/util";

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/Generic/Modal";

const DeleteColorModal = () => {
  const coloringState = useAppSelector((state) => state.coloringPage);
  const dispatch = useAppDispatch();

  function deleteColor(colorID: string) {
    dispatch(coloringPageActions.deleteColor(colorID));
    dbFuncs.deleteColor(colorID);

    for (const verseKey in coloringState.coloredVerses) {
      if (coloringState.coloredVerses[verseKey].colorID === colorID) {
        dbFuncs.deleteVerseColor(verseKey);
      }
    }
  }

  function onClickDelete() {
    if (!coloringState.currentColor) return;

    deleteColor(coloringState.currentColor.colorID);
  }

  const getColoredVerses = (colorID: string | undefined) => {
    if (!colorID) return 0;

    return Object.keys(coloringState.coloredVerses).filter((verseKey) => {
      return coloringState.coloredVerses[verseKey]?.colorID === colorID;
    }).length;
  };

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
              coloringState.currentColor
                ? {
                    backgroundColor: coloringState.currentColor.colorCode,
                    color: getTextColor(coloringState.currentColor.colorCode),
                  }
                : {}
            }
          >
            {coloringState.currentColor?.colorDisplay}
          </span>{" "}
          color? All verses colored with this color will be uncolored.
        </p>
        <p>
          Number of verses affected:{" "}
          {getColoredVerses(coloringState.currentColor?.colorID)}
        </p>
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
};

export default DeleteColorModal;
