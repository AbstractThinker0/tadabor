import { useRef, useState } from "react";
import { dbFuncs } from "../../util/db";
import { tagProps } from "./consts";

interface AddTagModalProps {
  addTag: (tag: tagProps) => void;
}

const AddTagModal = ({ addTag }: AddTagModalProps) => {
  const refCloseButton = useRef<HTMLButtonElement>(null);
  const [tagName, setTagName] = useState("");

  function onChangeName(event: React.ChangeEvent<HTMLInputElement>) {
    setTagName(event.target.value);
  }

  function onClickSave() {
    if (!tagName) {
      alert("Please enter the tag display name");
      return;
    }

    const newTag: tagProps = {
      tagID: Date.now().toString(),
      tagDisplay: tagName,
    };

    addTag(newTag);

    dbFuncs.saveTag({
      id: newTag.tagID,
      name: newTag.tagDisplay,
    });

    setTagName("");
    refCloseButton.current?.click();
  }

  return (
    <div
      className="modal fade"
      id="addTagModal"
      tabIndex={-1}
      aria-labelledby="addTagModalLabel"
      aria-hidden="true"
      dir="ltr"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="addTagModalLabel">
              Add a new tag
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="pb-1">
              <label className="w-25">Display name: </label>
              <input
                type="text"
                placeholder="display name"
                value={tagName}
                onChange={onChangeName}
              />
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              ref={refCloseButton}
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClickSave}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTagModal;
