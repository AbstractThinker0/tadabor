import { useEffect, useState } from "react";
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

  const [rows, setRows] = useState(4);

  if (!value) {
    editableNotes[verse_key] = true;
  }

  let isNoteEditable = editableNotes[verse_key];

  useEffect(() => {
    const rowlen = value.split("\n");

    if (rowlen.length >= 4) {
      setRows(rowlen.length + 1);
    } else {
      setRows(4);
    }
  }, [value]);

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
    >
      <div className="card-body">
        {isNoteEditable ? (
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

export default TextForm;
