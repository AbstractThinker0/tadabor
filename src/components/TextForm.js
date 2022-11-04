import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { IconTextDirectionLtr } from "@tabler/icons";
import { IconTextDirectionRtl } from "@tabler/icons";

const TextForm = ({
  inputKey,
  inputValue,
  inputDirection,
  handleSetDirection,
  handleInputChange,
  isEditable,
  handleEditClick,
  handleInputSubmit,
}) => {
  const collapseRef = useRef();

  useEffect(() => {
    let collapseElement = collapseRef.current;
    function onShownCollapse(event) {
      event.target.scrollIntoView({ block: "nearest" });
    }
    collapseElement.addEventListener("shown.bs.collapse", onShownCollapse);

    return () => {
      collapseElement.removeEventListener("shown.bs.collapse", onShownCollapse);
    };
  }, []);

  return (
    <div
      className="collapse card border-primary"
      id={"collapseExample" + inputKey}
      ref={collapseRef}
    >
      <div className="card-body">
        {isEditable === false ? (
          <TextComponent
            inputValue={inputValue}
            handleEditClick={handleEditClick}
            inputKey={inputKey}
            inputDirection={inputDirection}
          />
        ) : (
          <FormComponent
            inputKey={inputKey}
            inputValue={inputValue}
            inputDirection={inputDirection}
            handleSetDirection={handleSetDirection}
            handleInputSubmit={handleInputSubmit}
            handleInputChange={handleInputChange}
          />
        )}
      </div>
    </div>
  );
};

const TextComponent = ({
  inputValue,
  inputKey,
  inputDirection,
  handleEditClick,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div
        className="p-2 border border-1 border-success rounded"
        dir={inputDirection}
      >
        <p style={{ whiteSpace: "pre-wrap" }}>{inputValue}</p>
      </div>
      <div className="text-center">
        <button
          name={inputKey}
          onClick={handleEditClick}
          className="mt-2 btn btn-primary btn-sm"
        >
          {t("text_edit")}
        </button>
      </div>
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

const FormComponent = ({
  inputKey,
  inputValue,
  inputDirection,
  handleSetDirection,
  handleInputSubmit,
  handleInputChange,
}) => {
  const minRows = 4;
  const [rows, setRows] = useState(minRows);
  const formRef = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    formRef.current.scrollIntoView({ block: "nearest" });
  }, []);

  useEffect(() => {
    const rowlen = inputValue.split("\n").length;

    if (rowlen >= minRows) {
      setRows(rowlen + 2);
    } else {
      setRows(minRows);
    }
  }, [inputValue]);

  return (
    <form
      ref={formRef}
      name={inputKey}
      onSubmit={(event) => handleInputSubmit(event, inputValue)}
    >
      <div className="form-group">
        <TextareaToolbar>
          <ToolbarOption
            handleClick={() => handleSetDirection(inputKey, "ltr")}
          >
            <IconTextDirectionLtr />
          </ToolbarOption>
          <ToolbarOption
            handleClick={() => handleSetDirection(inputKey, "rtl")}
          >
            <IconTextDirectionRtl />
          </ToolbarOption>
        </TextareaToolbar>
        <textarea
          className="form-control mb-2"
          id="textInput"
          placeholder="أدخل كتاباتك"
          name={inputKey}
          value={inputValue}
          onChange={handleInputChange}
          rows={rows}
          dir={inputDirection}
          required
        />
      </div>
      <div className="text-center">
        <input
          type="submit"
          value={t("text_save")}
          className="btn btn-success btn-sm"
        />
      </div>
    </form>
  );
};

const YourNoteForm = ({
  inputKey,
  inputValue,
  inputDirection,
  handleSetDirection,
  handleInputSubmit,
  handleInputChange,
}) => {
  const minRows = 4;
  const [rows, setRows] = useState(minRows);
  const formRef = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    formRef.current.scrollIntoView({ block: "nearest" });
  }, []);

  useEffect(() => {
    const rowlen = inputValue.split("\n").length;

    if (rowlen >= minRows) {
      setRows(rowlen + 2);
    } else {
      setRows(minRows);
    }
  }, [inputValue]);

  return (
    <form
      ref={formRef}
      name={inputKey}
      onSubmit={(event) => handleInputSubmit(event, inputValue)}
    >
      <div className="card-body form-group">
        <TextareaToolbar>
          <ToolbarOption
            handleClick={() => handleSetDirection(inputKey, "ltr")}
          >
            <IconTextDirectionLtr />
          </ToolbarOption>
          <ToolbarOption
            handleClick={() => handleSetDirection(inputKey, "rtl")}
          >
            <IconTextDirectionRtl />
          </ToolbarOption>
        </TextareaToolbar>
        <textarea
          className="form-control  mb-2"
          id="textInput"
          placeholder="أدخل كتاباتك"
          name={inputKey}
          value={inputValue}
          onChange={handleInputChange}
          rows={rows}
          dir={inputDirection}
          required
        />
      </div>
      <div className="card-footer text-center">
        <input
          type="submit"
          value={t("text_save")}
          className="btn btn-success btn-sm"
        />
      </div>
    </form>
  );
};

const YourNoteText = ({
  inputValue,
  inputKey,
  inputDirection,
  handleEditClick,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="card-body" dir={inputDirection}>
        <p style={{ whiteSpace: "pre-wrap" }}>{inputValue}</p>
      </div>
      <div className="card-footer text-center">
        <button
          name={inputKey}
          onClick={handleEditClick}
          className="mt-2 btn btn-primary btn-sm"
        >
          {t("text_edit")}
        </button>
      </div>
    </>
  );
};

export { TextForm, YourNoteForm, YourNoteText };
