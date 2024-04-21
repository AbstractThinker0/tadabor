import { useRef, useState } from "react";
import { dbFuncs } from "@/util/db";
import { tagProps } from "./consts";

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/Generic/Modal";

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
    <ModalContainer identifier="addTagModal">
      <ModalHeader identifier="addTagModal" title="Add a new tag" />
      <ModalBody>
        <div className="pb-1">
          <label className="w-25">Display name: </label>
          <input
            type="text"
            placeholder="display name"
            value={tagName}
            onChange={onChangeName}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          ref={refCloseButton}
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Close
        </button>
        <button type="button" className="btn btn-primary" onClick={onClickSave}>
          Save changes
        </button>
      </ModalFooter>
    </ModalContainer>
  );
};

export default AddTagModal;
