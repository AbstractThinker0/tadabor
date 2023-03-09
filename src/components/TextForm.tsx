import { FormEvent, memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { IconTextDirectionLtr } from "@tabler/icons-react";
import { IconTextDirectionRtl } from "@tabler/icons-react";

interface TextFormProps {
  inputKey: string;
  inputValue: string;
  inputDirection: string;
  handleSetDirection: (verse_key: string, dir: string) => void;
  handleInputChange: (key: string, value: string) => void;
  isEditable: boolean;
  handleEditClick: (key: string) => void;
  handleInputSubmit: (key: string, value: string) => void;
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
    handleInputSubmit,
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
                handleEditButtonClick={handleEditClick}
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
      </div>
    );
  }
);

interface TextComponentProps {
  inputKey: string;
  inputValue: string;
  inputDirection: string;
  handleEditButtonClick: (key: string) => void;
}

const TextComponent = ({
  inputValue,
  inputKey,
  inputDirection,
  handleEditButtonClick,
}: TextComponentProps) => {
  const { t } = useTranslation();

  function onClickEditButton(event: React.MouseEvent<HTMLButtonElement>) {
    handleEditButtonClick(inputKey);
  }

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
          onClick={onClickEditButton}
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

interface ToolbarOptionProps {
  handleClick: () => void;
  children: JSX.Element;
}

function ToolbarOption(props: ToolbarOptionProps) {
  function onClickButton() {
    props.handleClick();
  }

  return (
    <button type="button" className="btn btn-sm" onClick={onClickButton}>
      {props.children}
    </button>
  );
}

interface FormComponentProps {
  inputKey: string;
  inputValue: string;
  inputDirection: string;
  handleSetDirection: (key: string, direction: string) => void;
  handleInputSubmit: (key: string, value: string) => void;
  handleInputChange: (key: string, value: string) => void;
}

const FormComponent = ({
  inputKey,
  inputValue,
  inputDirection,
  handleSetDirection,
  handleInputSubmit,
  handleInputChange,
}: FormComponentProps) => {
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

  function onSubmitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleInputSubmit(inputKey, inputValue);
  }

  function onChangeInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    handleInputChange(inputKey, event.target.value);
  }

  return (
    <form ref={formRef} name={inputKey} onSubmit={onSubmitForm}>
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
          onChange={onChangeInput}
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
}: FormComponentProps) => {
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

  function onSubmitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    handleInputSubmit(inputKey, inputValue);
  }

  function onChangeInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    handleInputChange(inputKey, event.target.value);
  }

  return (
    <form ref={formRef} name={inputKey} onSubmit={onSubmitForm}>
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
          onChange={onChangeInput}
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

interface YourNoteTextProps {
  inputKey: string;
  inputValue: string;
  inputDirection: string;
  handleEditButtonClick: (key: string) => void;
}

const YourNoteText = ({
  inputValue,
  inputKey,
  inputDirection,
  handleEditButtonClick,
}: YourNoteTextProps) => {
  const { t } = useTranslation();

  function onClickEditButton(event: React.MouseEvent<HTMLButtonElement>) {
    handleEditButtonClick(inputKey);
  }

  return (
    <>
      <div className="card-body" dir={inputDirection}>
        <p style={{ whiteSpace: "pre-wrap" }}>{inputValue}</p>
      </div>
      <div className="card-footer text-center">
        <button
          name={inputKey}
          onClick={onClickEditButton}
          className="mt-2 btn btn-primary btn-sm"
        >
          {t("text_edit")}
        </button>
      </div>
    </>
  );
};

export { TextForm, YourNoteForm, YourNoteText };
