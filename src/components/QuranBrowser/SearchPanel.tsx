import { memo, Dispatch } from "react";
import { useTranslation } from "react-i18next";
import useQuran from "@/context/useQuran";

import SelectionListChapters from "@/components/QuranBrowser/SelectionListChapters";
import SelectionListRoots from "@/components/QuranBrowser/SelectionListRoots";

import { verseMatchResult } from "@/types";
import {
  SEARCH_METHOD,
  qbActions,
  qbActionsProps,
} from "@/components/QuranBrowser/consts";

import { IconSearch } from "@tabler/icons-react";

interface SearchPanelProps {
  currentChapter: number;
  searchMethod: string;
  searchDiacritics: boolean;
  searchIdentical: boolean;
  searchString: string;
  searchResult: verseMatchResult[];
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const SearchPanel = memo(
  ({
    currentChapter,
    searchMethod,
    searchDiacritics,
    searchIdentical,
    searchString,
    searchResult,
    dispatchQbAction,
  }: SearchPanelProps) => {
    const quranService = useQuran();
    const { t } = useTranslation();

    const isRootSearch = searchMethod === SEARCH_METHOD.ROOT ? true : false;

    function setSearchDiacritics(status: boolean) {
      dispatchQbAction(qbActions.setSearchDiacritics(status));
    }

    function setSearchIdentical(status: boolean) {
      dispatchQbAction(qbActions.setSearchIdentical(status));
    }

    function setSearchMethod(method: SEARCH_METHOD) {
      dispatchQbAction(qbActions.setSearchMethod(method));
    }

    function onSearchSubmit() {
      if (isRootSearch) {
        dispatchQbAction(
          qbActions.submitRootSearch({
            absoluteQuran: quranService.absoluteQuran,
            chapterNames: quranService.chapterNames,
            quranRoots: quranService.quranRoots,
          })
        );
      } else {
        dispatchQbAction(
          qbActions.submitWordSearch({
            allQuranText: quranService.allQuranText,
            chapterNames: quranService.chapterNames,
          })
        );
      }
    }

    const handleCurrentChapter = (chapterID: number) => {
      dispatchQbAction(qbActions.gotoChapter(chapterID.toString()));
    };

    const handleSelectedChapters = (selectedChapters: string[]) => {
      dispatchQbAction(qbActions.setSelectedChapters(selectedChapters));
    };

    return (
      <div className="browser-search">
        <SelectionListChapters
          handleSelectedChapters={handleSelectedChapters}
          handleCurrentChapter={handleCurrentChapter}
          currentChapter={currentChapter}
        />
        <div className="browser-search-options">
          <RadioSearchMethod
            searchMethod={searchMethod}
            setSearchMethod={setSearchMethod}
          />
          <CheckboxComponent
            checkboxState={searchDiacritics}
            setCheckBoxState={setSearchDiacritics}
            labelText={t("search_diacritics")}
            isDisabled={isRootSearch}
            inputID="CheckboxDiacritics"
          />
          <CheckboxComponent
            checkboxState={searchIdentical}
            setCheckBoxState={setSearchIdentical}
            labelText={t("search_identical")}
            isDisabled={isRootSearch}
            inputID="CheckboxIdentical"
          />
        </div>
        <FormWordSearch
          onSearchSubmit={onSearchSubmit}
          searchString={searchString}
          dispatchQbAction={dispatchQbAction}
        />
        <SelectionListRoots
          isDisabled={!isRootSearch}
          searchString={searchString}
          dispatchQbAction={dispatchQbAction}
        />
        <SearchSuccessComponent searchResult={searchResult} />
      </div>
    );
  }
);

SearchPanel.displayName = "SearchPanel";

interface RadioSearchMethodProps {
  searchMethod: string;
  setSearchMethod: (method: SEARCH_METHOD) => void;
}

const RadioSearchMethod = ({
  searchMethod,
  setSearchMethod,
}: RadioSearchMethodProps) => {
  const { t, i18n } = useTranslation();
  const handleSearchMethod = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMethod(event.target.value as SEARCH_METHOD);
  };
  return (
    <div className="browser-search-options-method">
      <span className="fw-bold">{t("search_method")}</span>
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
          value={SEARCH_METHOD.ROOT}
          checked={searchMethod === SEARCH_METHOD.ROOT}
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
          value={SEARCH_METHOD.WORD}
          checked={searchMethod === SEARCH_METHOD.WORD}
          onChange={handleSearchMethod}
        />
        <label className="form-check-label" htmlFor="inlineRadio2">
          {t("search_word")}
        </label>
      </div>
    </div>
  );
};

interface FormWordSearchProps {
  onSearchSubmit: () => void;
  searchString: string;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const FormWordSearch = ({
  onSearchSubmit,
  searchString,
  dispatchQbAction,
}: FormWordSearchProps) => {
  const { t } = useTranslation();

  const searchStringHandle = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatchQbAction(qbActions.setSearchString(event.target.value));
  };

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSearchSubmit();
  }

  return (
    <form className="p-0" role="search" onSubmit={handleSearchSubmit}>
      <div className="">
        <div>
          <textarea
            required
            dir="rtl"
            className="form-control browser-search-field"
            placeholder=""
            aria-label="Search"
            onChange={searchStringHandle}
            id="exampleFormControlTextarea1"
            rows={1}
            value={searchString}
          />
        </div>
        <div className="pt-1 ">
          <button
            className="btn btn-outline-success w-50 fw-bold"
            type="submit"
          >
            <IconSearch size={15} stroke={3} /> {t("search_button")}
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
  inputID?: string;
}

const CheckboxComponent = ({
  checkboxState,
  setCheckBoxState,
  labelText,
  isDisabled = false,
  inputID,
}: CheckBoxProps) => {
  const { i18n } = useTranslation();

  const handleChangeCheckboxState = () => {
    setCheckBoxState(!checkboxState);
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
        onChange={handleChangeCheckboxState}
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

interface SearchSuccessComponentProps {
  searchResult: verseMatchResult[];
}

const SearchSuccessComponent = ({
  searchResult,
}: SearchSuccessComponentProps) => {
  const { t } = useTranslation();
  return (
    <>
      {searchResult.length > 0 && (
        <div className="fw-bold text-success">
          {t("search_count") + " " + searchResult.length}{" "}
        </div>
      )}
    </>
  );
};

export default SearchPanel;
