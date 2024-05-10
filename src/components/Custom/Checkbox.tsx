import { useTranslation } from "react-i18next";

interface CheckboxProps {
  checkboxState: boolean;
  handleChangeCheckbox: (status: boolean) => void;
  labelText: string;
  inputID?: string;
  isDisabled?: boolean;
}

const Checkbox = ({
  checkboxState,
  handleChangeCheckbox,
  labelText,
  inputID,
  isDisabled = false,
}: CheckboxProps) => {
  const { i18n } = useTranslation();

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeCheckbox(event.target.checked);
  };

  return (
    <div
      className={`form-check  ${
        i18n.resolvedLanguage === "ar" && "form-check-reverse"
      }`}
    >
      <input
        className="form-check-input"
        type="checkbox"
        checked={checkboxState}
        onChange={onChangeInput}
        value=""
        id={inputID}
        disabled={isDisabled}
      />
      <label className="form-check-label" htmlFor={inputID}>
        {labelText}
      </label>
    </div>
  );
};

export default Checkbox;
