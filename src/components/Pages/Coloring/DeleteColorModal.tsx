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
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );
  const currentColor = useAppSelector(
    (state) => state.coloringPage.currentColor
  );

  const dispatch = useAppDispatch();

  function deleteColor(colorID: string) {
    dispatch(coloringPageActions.deleteColor(colorID));
    dbFuncs.deleteColor(colorID);

    for (const verseKey in coloredVerses) {
      if (coloredVerses[verseKey].colorID === colorID) {
        dbFuncs.deleteVerseColor(verseKey);
      }
    }
  }

  function onClickDelete() {
    if (!currentColor) return;

    deleteColor(currentColor.colorID);
  }

  const getColoredVerses = (colorID: string | undefined) => {
    if (!colorID) return 0;

    return Object.keys(coloredVerses).filter((verseKey) => {
      return coloredVerses[verseKey]?.colorID === colorID;
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
        <p>
          Number of verses affected: {getColoredVerses(currentColor?.colorID)}
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
