import { Dispatch, Fragment, SetStateAction } from "react";

import { useTranslation } from "react-i18next";

const arabicAlpha = [
  "ا",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "ه",
  "و",
  "ى",
  "ي",
];

interface SearchFormProps {
  searchString: string;
  searchInclusive: boolean;
  setSearchString: Dispatch<SetStateAction<string>>;
  setSearchInclusive: Dispatch<SetStateAction<boolean>>;
}

const SearchForm = ({
  searchString,
  searchInclusive,
  setSearchString,
  setSearchInclusive,
}: SearchFormProps) => {
  const { i18n, t } = useTranslation();

  const searchStringHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const onLetterClick = (letter: string) => {
    setSearchString(letter);
  };

  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInclusive(event.target.checked);
  };

  return (
    <div className="container p-3">
      <div className="d-flex align-items-center flex-column">
        <div className="w-25">
          <input
            className="form-control"
            type="search"
            placeholder=""
            value={searchString}
            aria-label="Search"
            onChange={searchStringHandle}
            required
            dir="rtl"
          />
          <div className="d-flex gap-1 align-self-start">
            <span className="fw-bold">{t("search_options")}</span>{" "}
            <div
              className={`form-check   ${
                i18n.resolvedLanguage === "ar" && "form-check-reverse"
              }`}
            >
              <input
                className="form-check-input"
                type="checkbox"
                checked={searchInclusive}
                onChange={handleChangeCheckbox}
                value=""
                id="CheckInc"
              />
              <label className="form-check-label" htmlFor="CheckInc">
                {t("search_inclusive")}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="row pt-1" dir="rtl">
        <div className="container text-center">
          {arabicAlpha.map((letter, index) => (
            <Fragment key={index}>
              <span
                role="button"
                className="text-primary"
                onClick={() => onLetterClick(letter)}
              >
                {" "}
                {letter}{" "}
              </span>
              {index < arabicAlpha.length - 1 && (
                <span
                  style={{ borderLeft: "1px solid grey", margin: "0 7.5px" }}
                ></span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
