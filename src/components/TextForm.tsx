import { FormEvent, useEffect, useRef, useState } from "react";
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

const TextForm = ({
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
              textClassname="p-2 border border-1 border-success rounded"
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
};
interface TextComponentProps {
  inputKey: string;
  inputValue: string;
  inputDirection: string;
  handleEditButtonClick: (key: string) => void;
  textClassname?: string;
  editClassname?: string;
}

const TextComponent = ({
  inputValue,
  inputKey,
  inputDirection,
  handleEditButtonClick,
  textClassname = "",
  editClassname = "",
}: TextComponentProps) => {
  return (
    <>
      <TextContainer
        inputDirection={inputDirection}
        inputValue={inputValue}
        className={textClassname}
      />
      <TextEditButton
        inputKey={inputKey}
        handleEditButtonClick={handleEditButtonClick}
        className={editClassname}
      />
    </>
  );
};

interface TextContainerProps {
  inputValue: string;
  inputDirection: string;
  className?: string;
}

const TextContainer = ({
  inputDirection,
  inputValue,
  className = "",
}: TextContainerProps) => {
  return (
    <div className={className} dir={inputDirection}>
      <p style={{ whiteSpace: "pre-wrap" }}>{inputValue}</p>
    </div>
  );
};

interface TextEditButtonProps {
  inputKey: string;
  handleEditButtonClick: (key: string) => void;
  className?: string;
}

const TextEditButton = ({
  inputKey,
  handleEditButtonClick,
  className = "",
}: TextEditButtonProps) => {
  const { t } = useTranslation();

  function onClickEditButton(event: React.MouseEvent<HTMLButtonElement>) {
    handleEditButtonClick(inputKey);
  }

  return (
    <div className={"text-center ".concat(className)}>
      <button
        name={inputKey}
        onClick={onClickEditButton}
        className="mt-2 btn btn-primary btn-sm"
      >
        {t("text_edit")}
      </button>
    </div>
  );
};

interface TextareaToolbarProps {
  inputKey: string;
  handleSetDirection: (key: string, direction: string) => void;
}

const TextareaToolbar = ({
  inputKey,
  handleSetDirection,
}: TextareaToolbarProps) => {
  return (
    <div dir="ltr" className="text-center">
      <ToolbarOption handleClick={() => handleSetDirection(inputKey, "ltr")}>
        <IconTextDirectionLtr />
      </ToolbarOption>
      <ToolbarOption handleClick={() => handleSetDirection(inputKey, "rtl")}>
        <IconTextDirectionRtl />
      </ToolbarOption>
    </div>
  );
};

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
  bodyClassname?: string;
  saveClassname?: string;
}

const FormComponent = ({
  inputKey,
  inputValue,
  inputDirection,
  handleSetDirection,
  handleInputSubmit,
  handleInputChange,
  bodyClassname = "",
  saveClassname = "",
}: FormComponentProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current !== null)
      formRef.current.scrollIntoView({ block: "nearest" });
  }, []);

  function onSubmitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleInputSubmit(inputKey, inputValue);
  }

  return (
    <form ref={formRef} name={inputKey} onSubmit={onSubmitForm}>
      <div className={"form-group ".concat(bodyClassname)}>
        <TextareaToolbar
          inputKey={inputKey}
          handleSetDirection={handleSetDirection}
        />
        <TextAreaComponent
          inputKey={inputKey}
          inputValue={inputValue}
          inputDirection={inputDirection}
          handleInputChange={handleInputChange}
        />
      </div>
      <FormSaveButton className={saveClassname} />
    </form>
  );
};

const FormSaveButton = ({ className = "" }) => {
  const { t } = useTranslation();

  return (
    <div className={"text-center ".concat(className)}>
      <input
        type="submit"
        value={t("text_save")}
        className="btn btn-success btn-sm"
      />
    </div>
  );
};

interface TextAreaProps {
  inputKey: string;
  inputValue: string;
  inputDirection: string;
  handleInputChange: (key: string, value: string) => void;
}

const TextAreaComponent = ({
  inputKey,
  inputValue,
  inputDirection,
  handleInputChange,
}: TextAreaProps) => {
  const minRows = 4;
  const [rows, setRows] = useState(minRows);

  useEffect(() => {
    const rowlen = inputValue.split("\n").length;

    if (rowlen >= minRows) {
      setRows(rowlen + 2);
    } else {
      setRows(minRows);
    }
  }, [inputValue]);

  function onChangeInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    handleInputChange(inputKey, event.target.value);
  }

  return (
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
  );
};

export { TextForm, FormComponent, TextComponent };
