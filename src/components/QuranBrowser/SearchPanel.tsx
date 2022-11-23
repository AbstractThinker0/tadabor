import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ACTIONS, useQuranBrowser } from "../../pages/QuranBrowser";

import SelectionListChapters from "../SelectionListChapters";
import SelectionListRoots from "../SelectionListRoots";

const SearchPanel = memo(
  ({
    memoHandleSelectionListChapters,
    refListChapters,
    radioSearchMethod,
    setRadioSearchMethod,
    searchDiacritics,
    searchIdentical,
    searchAllQuran,
    memoHandleSearchSubmit,
    searchString,
    searchResult,
    selectedChapters,
  }: any) => {
    const { t } = useTranslation();
    const { dispatch } = useQuranBrowser();

    let isRootSearch = radioSearchMethod === "optionRootSearch" ? true : false;

    function setSearchAllQuran(status: boolean) {
      dispatch({ type: ACTIONS.SET_SEARCH_ALLQURAN, payload: status });
    }

    function setSearchDiacritics(status: boolean) {
      dispatch({ type: ACTIONS.SET_SEARCH_DIACRITICS, payload: status });
    }

    function setSearchIdentical(status: boolean) {
      dispatch({ type: ACTIONS.SET_SEARCH_IDENTICAL, payload: status });
    }

    return (
      <div className="browser-search">
        <SelectionListChapters
          handleSelectionListChapters={memoHandleSelectionListChapters}
          innerRef={refListChapters}
          selectedChapters={selectedChapters}
        />
        <RadioSearchMethod
          radioSearchMethod={radioSearchMethod}
          setRadioSearchMethod={setRadioSearchMethod}
        />
        <CheckboxComponent
          checkboxState={searchDiacritics}
          setCheckBoxState={setSearchDiacritics}
          labelText={t("search_diacritics")}
          isDisabled={isRootSearch}
        />
        <CheckboxComponent
          checkboxState={searchIdentical}
          setCheckBoxState={setSearchIdentical}
          labelText={t("search_identical")}
          isDisabled={isRootSearch}
        />
        <CheckboxComponent
          checkboxState={searchAllQuran}
          setCheckBoxState={setSearchAllQuran}
          labelText={t("search_all_quran")}
        />
        <FormWordSearch
          handleSearchSubmit={memoHandleSearchSubmit}
          searchString={searchString}
        />
        <SelectionListRoots
          isDisabled={!isRootSearch}
          searchString={searchString}
        />
        <SearchSuccessComponent searchResult={searchResult} />
      </div>
    );
  }
);

SearchPanel.displayName = "SearchPanel";

const RadioSearchMethod = ({
  radioSearchMethod,
  setRadioSearchMethod,
}: any) => {
  const { t, i18n } = useTranslation();
  const handleSearchMethod = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioSearchMethod(event.target.value);
  };
  return (
    <div>
      {t("search_method")}
      <div
        className={`form-check form-check-inline ${
          i18n.resolvedLanguage === "ar" && "form-check-reverse"
        }`}
      >
        <input
          className="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio1"
          value="optionRootSearch"
          checked={radioSearchMethod === "optionRootSearch"}
          onChange={handleSearchMethod}
        />
        <label className="form-check-label" htmlFor="inlineRadio1">
          {t("search_root")}
        </label>
      </div>
      <div
        className={`form-check form-check-inline ${
          i18n.resolvedLanguage === "ar" && "form-check-reverse"
        }`}
      >
        <input
          className="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio2"
          value="optionWordSearch"
          checked={radioSearchMethod === "optionWordSearch"}
          onChange={handleSearchMethod}
        />
        <label className="form-check-label" htmlFor="inlineRadio2">
          {t("search_word")}
        </label>
      </div>
    </div>
  );
};

const FormWordSearch = ({ handleSearchSubmit, searchString }: any) => {
  const { dispatch } = useQuranBrowser();
  const { t } = useTranslation();

  const searchStringHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ACTIONS.SET_SEARCH_STRING, payload: event.target.value });
  };

  return (
    <form
      className="container p-0 mt-2"
      role="search"
      onSubmit={handleSearchSubmit}
    >
      <div className="row">
        <div className="col">
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
        </div>
        <div className="col">
          <button className="btn btn-outline-success" type="submit">
            {t("search_button")}
          </button>
        </div>
      </div>
    </form>
  );
};

interface CheckBoxProps {
  checkboxState: boolean;
  setCheckBoxState: (status: boolean) => void;
  labelText: string;
  isDisabled?: boolean;
}

const CheckboxComponent = ({
  checkboxState,
  setCheckBoxState,
  labelText,
  isDisabled = false,
}: CheckBoxProps) => {
  const { i18n } = useTranslation();

  const handleChangeCheckboxState = () => {
    setCheckBoxState(!checkboxState);
  };
  return (
    <div
      className={`form-check mt-2  ${
        i18n.resolvedLanguage === "ar" && "form-check-reverse"
      }`}
    >
      <input
        className="form-check-input"
        type="checkbox"
        checked={checkboxState}
        onChange={handleChangeCheckboxState}
        value=""
        id="flexCheckDefault"
        disabled={isDisabled}
      />
      <label className="form-check-label" htmlFor="flexCheckDefault">
        {labelText}
      </label>
    </div>
  );
};

const SearchSuccessComponent = ({ searchResult }: { searchResult: string }) => {
  const { t } = useTranslation();
  return (
    <>
      {searchResult.length > 0 && (
        <p className="mt-3 text-success">
          {t("search_count") + " " + searchResult.length}{" "}
        </p>
      )}
    </>
  );
};

export default SearchPanel;
