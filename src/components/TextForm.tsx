import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { IconTextDirectionLtr } from "@tabler/icons-react";
import { IconTextDirectionRtl } from "@tabler/icons-react";

interface TextFormProps {
  inputKey: string;
  inputValue: string;
  inputDirection: string;
  handleSetDirection: (verse_key: string, dir: string) => void;
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  isEditable: boolean;
  handleEditClick: React.MouseEventHandler<HTMLButtonElement>;
  onInputSubmit: (key: string, value: string) => void;
}

const TextForm = memo(
  ({
    inputKey,
    inputValue,
    inputDirection,
    handleSetDirection,
    handleInputChange,
    isEditable,
    handleEditClick,
    onInputSubmit,
  }: TextFormProps) => {
    const collapseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      let collapseElement = collapseRef.current;
      function onShownCollapse(event: any) {
        event.target.scrollIntoView({ block: "nearest" });
      }

      if (collapseElement !== null) {
        collapseElement.addEventListener("shown.bs.collapse", onShownCollapse);
      }

      return () => {
        if (collapseElement !== null) {
          collapseElement.removeEventListener(
            "shown.bs.collapse",
            onShownCollapse
          );
        }
      };
    }, []);

    return (
      <div
        className="collapse"
        id={"collapseExample" + inputKey}
        ref={collapseRef}
      >
        <div className="card border-primary">
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
                onInputSubmit={onInputSubmit}
                handleInputChange={handleInputChange}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

const TextComponent = ({
  inputValue,
  inputKey,
  inputDirection,
  handleEditClick,
}: any) => {
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

const TextareaToolbar = memo((props: any) => {
  return (
    <div dir="ltr" className="text-center">
      {props.children}
    </div>
  );
});

function ToolbarOption(props: any) {
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
  onInputSubmit,
  handleInputChange,
}: any) => {
  const minRows = 4;
  const [rows, setRows] = useState(minRows);
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (formRef.current !== null)
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

  function handleInputSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onInputSubmit(inputKey, inputValue);
  }

  return (
    <form ref={formRef} name={inputKey} onSubmit={handleInputSubmit}>
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
}: any) => {
  const minRows = 4;
  const [rows, setRows] = useState(minRows);
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (formRef.current !== null)
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
}: any) => {
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
