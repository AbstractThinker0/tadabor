import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { db } from "../util/db";

import { IconTextDirectionLtr } from "@tabler/icons";
import { IconTextDirectionRtl } from "@tabler/icons";

const TextForm = ({
  verse_key,
  value,
  noteDirection,
  handleSetDirection,
  handleNoteChange,
  isEditable,
  setEditableNotes,
}) => {
  const { t } = useTranslation();

  const formRef = useRef();

  useEffect(() => {
    let formElement = formRef.current;
    function onShownCollapse(event) {
      scrollIntoViewIfNeeded(event.target);
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
        setEditableNotes((state) => {
          return { ...state, [verse_key]: false };
        });
      })
      .catch(function (error) {
        //
        toast.success(t("save_failed"));
      });
  };

  const handleEditClick = () => {
    setEditableNotes((state) => {
      return { ...state, [verse_key]: true };
    });
  };

  return (
    <div
      className="collapse card border-primary"
      id={"collapseExample" + verse_key}
      ref={formRef}
    >
      <div className="card-body">
        {isEditable === false ? (
          <TextComponent value={value} handleEditClick={handleEditClick} />
        ) : (
          <FormComponent
            verse_key={verse_key}
            value={value}
            noteDirection={noteDirection}
            handleSetDirection={handleSetDirection}
            handleNoteSubmit={handleNoteSubmit}
            handleNoteChange={handleNoteChange}
          />
        )}
      </div>
    </div>
  );
};

const TextComponent = ({ value, handleEditClick }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="p-2 border border-1 border-success rounded">
        <p style={{ whiteSpace: "pre-wrap" }}>{value}</p>
      </div>
      <button onClick={handleEditClick} className="mt-2 btn btn-primary btn-sm">
        {t("text_edit")}
      </button>
    </>
  );
};

const TextareaToolbar = memo((props) => {
  return (
    <div dir="ltr" className="text-center">
      {props.children}
    </div>
  );
});

function ToolbarOption(props) {
  return (
    <button type="button" className="btn btn-sm" onClick={props.handleClick}>
      {props.children}
    </button>
  );
}

function scrollIntoViewIfNeeded(target) {
  if (target.getBoundingClientRect().bottom > window.innerHeight) {
    target.scrollIntoView(false);
  }

  if (target.getBoundingClientRect().top < 0) {
    target.scrollIntoView();
  }
}

const FormComponent = ({
  verse_key,
  value,
  noteDirection,
  handleSetDirection,
  handleNoteSubmit,
  handleNoteChange,
}) => {
  const [rows, setRows] = useState(4);
  const formRef = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    scrollIntoViewIfNeeded(formRef.current);
  }, []);

  useEffect(() => {
    const rowlen = value.split("\n");

    if (rowlen.length >= 4) {
      setRows(rowlen.length + 1);
    } else {
      setRows(4);
    }
  }, [value]);

  return (
    <form ref={formRef} onSubmit={handleNoteSubmit}>
      <div className="form-group">
        <TextareaToolbar>
          <ToolbarOption
            handleClick={() => handleSetDirection(verse_key, "ltr")}
          >
            <IconTextDirectionLtr />
          </ToolbarOption>
          <ToolbarOption
            handleClick={() => handleSetDirection(verse_key, "rtl")}
          >
            <IconTextDirectionRtl />
          </ToolbarOption>
        </TextareaToolbar>
        <textarea
          className="form-control  mb-2"
          id="textInput"
          placeholder="أدخل كتاباتك"
          name={verse_key}
          value={value}
          onChange={handleNoteChange}
          rows={rows}
          dir={noteDirection}
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
