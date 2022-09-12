import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { db } from "../util/db";

const TextComponent = (props) => {
  return (
    <div className="p-2 border border-1 border-success rounded">
      <p style={{ whiteSpace: "pre-wrap" }}>{props.children}</p>
    </div>
  );
};

const TextForm = ({
  verse_key,
  value,
  handleNoteChange,
  editableNotes,
  setEditableNotes,
}) => {
  const { t } = useTranslation();

  const formRef = useRef();

  if (!value) {
    editableNotes[verse_key] = true;
  }

  let isNoteEditable = editableNotes[verse_key];

  useEffect(() => {
    let formElement = formRef.current;
    function onShownCollapse(event) {
      event.target.scrollIntoView({ block: "center" });
    }
    formElement.addEventListener("shown.bs.collapse", onShownCollapse);

    return () => {
      formElement.removeEventListener("shown.bs.collapse", onShownCollapse);
    };
  }, []);

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    db.notes
      .put({
        id: verse_key,
        text: value,
        date_created: Date.now(),
        date_modified: Date.now(),
      })
      .then(function (result) {
        //
        toast.success(t("save_success"));
        editableNotes[verse_key] = false;
        setEditableNotes({ ...editableNotes });
      })
      .catch(function (error) {
        //
        toast.success(t("save_failed"));
      });
  };

  const handleEditClick = () => {
    editableNotes[verse_key] = true;
    setEditableNotes({ ...editableNotes });
  };

  return (
    <div
      className="collapse card border-primary"
      id={"collapseExample" + verse_key}
      ref={formRef}
    >
      <div className="card-body">
        {isNoteEditable ? (
          <FormComponent
            verse_key={verse_key}
            value={value}
            handleNoteSubmit={handleNoteSubmit}
            handleNoteChange={handleNoteChange}
          />
        ) : (
          <>
            <TextComponent>{value}</TextComponent>
            <button
              onClick={handleEditClick}
              className="mt-2 btn btn-primary btn-sm"
            >
              {t("text_edit")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const FormComponent = ({
  verse_key,
  value,
  handleNoteSubmit,
  handleNoteChange,
}) => {
  const [rows, setRows] = useState(4);
  const { t } = useTranslation();

  useEffect(() => {
    const rowlen = value.split("\n");

    if (rowlen.length >= 4) {
      setRows(rowlen.length + 1);
    } else {
      setRows(4);
    }
  }, [value]);

  return (
    <form onSubmit={handleNoteSubmit}>
      <div className="form-group">
        <textarea
          className="form-control  mb-2"
          id="textInput"
          placeholder="أدخل كتاباتك"
          name={verse_key}
          value={value}
          onChange={handleNoteChange}
          rows={rows}
          required
        />
      </div>
      <input
        type="submit"
        value={t("text_save")}
        className="btn btn-success btn-sm"
      />
    </form>
  );
};

export default TextForm;
