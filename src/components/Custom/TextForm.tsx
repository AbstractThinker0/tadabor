import { FormEvent, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/store";

import TextareaToolbar from "@/components/Generic/TextareaToolbar";
import { CollapseContent } from "@/components/Generic/Collapse";

interface TextFormProps {
  inputKey: string;
  inputValue: string;
  inputDirection: string;
  isEditable: boolean;
  className?: string;
  targetID?: string;
  handleSetDirection: (verse_key: string, dir: string) => void;
  handleInputChange: (key: string, value: string) => void;
  handleEditClick: () => void;
  handleInputSubmit: (key: string, value: string) => void;
}

const TextForm = ({
  inputKey,
  inputValue,
  inputDirection,
  isEditable,
  className = "",
  targetID,
  handleSetDirection,
  handleInputChange,
  handleEditClick,
  handleInputSubmit,
}: TextFormProps) => {
  const formRef = useRef<HTMLDivElement>(null);

  const handleEditButtonClick = () => {
    handleEditClick();

    if (formRef.current)
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  };

  return (
    <TextCollapsible
      className={className}
      targetID={targetID ? targetID : inputKey}
    >
      <div className="card border-primary" ref={formRef}>
        <div className="card-body">
          {isEditable === false ? (
            <TextComponent
              inputValue={inputValue}
              handleEditButtonClick={handleEditButtonClick}
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
    </TextCollapsible>
  );
};

interface TextCollapsibleProps {
  className?: string;
  targetID: string;
  children: JSX.Element;
}

const TextCollapsible = ({
  className = "",
  targetID,
  children,
}: TextCollapsibleProps) => {
  const collapseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const collapseElement = collapseRef.current;

    if (!collapseElement) return;

    function onShownCollapse(event: Event) {
      event.stopPropagation();

      if (!collapseElement) return;

      if (collapseElement.parentElement)
        collapseElement.parentElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
    }

    function onHiddenCollapse(event: Event) {
      event.stopPropagation();
    }

    collapseElement.addEventListener("shown.bs.collapse", onShownCollapse);
    collapseElement.addEventListener("hidden.bs.collapse", onHiddenCollapse);

    return () => {
      collapseElement.removeEventListener("shown.bs.collapse", onShownCollapse);
      collapseElement.removeEventListener(
        "hidden.bs.collapse",
        onHiddenCollapse
      );
    };
  }, []);

  return (
    <CollapseContent
      extraClass={className}
      identifier={`collapseExample${targetID}`}
      refCollapse={collapseRef}
    >
      {children}
    </CollapseContent>
  );
};

interface TextComponentProps {
  inputKey: string;
  inputValue: string;
  inputDirection: string;
  textClassname?: string;
  editClassname?: string;
  handleEditButtonClick: () => void;
}

const TextComponent = ({
  inputValue,
  inputKey,
  inputDirection,
  textClassname = "",
  editClassname = "",
  handleEditButtonClick,
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
  inputDirection?: string;
  className?: string;
}

const TextContainer = ({
  inputDirection = "",
  inputValue,
  className = "",
}: TextContainerProps) => {
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  return (
    <div className={className} dir={inputDirection}>
      <p style={{ whiteSpace: "pre-wrap", fontSize: `${notesFS}rem` }}>
        {inputValue}
      </p>
    </div>
  );
};

interface TextEditButtonProps {
  inputKey: string;
  className?: string;
  handleEditButtonClick: (key: string) => void;
}

const TextEditButton = ({
  inputKey,
  className = "",
  handleEditButtonClick,
}: TextEditButtonProps) => {
  const { t } = useTranslation();

  const onClickEditButton = () => {
    handleEditButtonClick(inputKey);
  };

  return (
    <div className={`text-center ${className}`}>
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

interface FormComponentProps {
  inputKey: string;
  inputValue: string;
  inputDirection: string;
  bodyClassname?: string;
  saveClassname?: string;
  handleSetDirection: (key: string, direction: string) => void;
  handleInputSubmit: (key: string, value: string) => void;
  handleInputChange: (key: string, value: string) => void;
}

const FormComponent = ({
  inputKey,
  inputValue,
  inputDirection,
  bodyClassname = "",
  saveClassname = "",
  handleSetDirection,
  handleInputSubmit,
  handleInputChange,
}: FormComponentProps) => {
  const onSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleInputSubmit(inputKey, inputValue);
  };

  return (
    <form name={inputKey} onSubmit={onSubmitForm}>
      <div className={`form-group ${bodyClassname}`}>
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
    <div className={`text-center ${className}`}>
      <input
        type="submit"
        value={t("text_save")}
        className="btn btn-success btn-sm"
      />
    </div>
  );
};

// snippet below  is from https://github.com/Andarist/react-textarea-autosize

const HIDDEN_TEXTAREA_STYLE = {
  "min-height": "0",
  "max-height": "none",
  height: "0",
  visibility: "hidden",
  overflow: "hidden",
  position: "absolute",
  "z-index": "-1000",
  top: "0",
  right: "0",
} as const;

const forceHiddenStyles = (node: HTMLElement) => {
  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach((key) => {
    node.style.setProperty(
      key,
      HIDDEN_TEXTAREA_STYLE[key as keyof typeof HIDDEN_TEXTAREA_STYLE],
      "important"
    );
  });
};

// snippet above  is from https://github.com/Andarist/react-textarea-autosize

interface TextAreaProps {
  inputKey: string;
  inputValue: string;
  inputDirection?: string;
  placeholder?: string;
  handleInputChange: (key: string, value: string) => void;
}

const TextAreaComponent = ({
  inputKey,
  inputValue,
  inputDirection = "",
  placeholder,
  handleInputChange,
}: TextAreaProps) => {
  const { t } = useTranslation();
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const refTextarea = useRef<HTMLTextAreaElement>(null);
  const refHidden = useRef<HTMLTextAreaElement>();

  const minSize = 100;
  const extraSize = 10;

  // Desc: create a hidden clone to use it for height calculations to apply a smooth resize on the original element
  // TODO: an optimization is to create a global element to handle all height calculations instead of creating a dedicated clone for every textarea element
  useEffect(() => {
    if (!refTextarea.current) return;
    if (!refHidden.current) {
      refHidden.current =
        refTextarea.current.cloneNode() as HTMLTextAreaElement;
      refHidden.current.setAttribute("tabindex", "-1");
      refHidden.current.setAttribute("aria-hidden", "true");
      forceHiddenStyles(refHidden.current);
      if (refTextarea.current.parentElement)
        refTextarea.current.parentElement.appendChild(refHidden.current);
    }
  }, []);

  useEffect(() => {
    const elementTextarea = refTextarea.current;
    const hiddenElement = refHidden.current;

    if (!elementTextarea || !hiddenElement) return;

    // Give the hidden element our input and apply a height to update scrollHeight to match content height
    hiddenElement.value = inputValue;
    hiddenElement.style.height = "auto";

    // We want to make sure that our element auto-resize to match the height of it's content
    elementTextarea.style.height =
      (hiddenElement.scrollHeight < minSize
        ? minSize
        : hiddenElement.scrollHeight + extraSize) + "px";
  }, [inputValue]);

  const onChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(inputKey, event.target.value);
  };

  return (
    <textarea
      ref={refTextarea}
      className="form-control mb-2"
      style={{ fontSize: `${notesFS}rem` }}
      id="textInput"
      placeholder={placeholder ? placeholder : t("text_form")}
      name={inputKey}
      value={inputValue}
      onChange={onChangeInput}
      dir={inputDirection}
      required
    />
  );
};

export { TextForm, FormComponent, TextComponent, TextAreaComponent };
