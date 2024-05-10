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

import { SearchButton } from "@/components/Generic/Buttons";

import Checkbox from "@/components/Custom/Checkbox";

interface SearchPanelProps {
  currentChapter: number;
  searchMethod: string;
  searchDiacritics: boolean;
  searchIdentical: boolean;
  searchStart: boolean;
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
    searchStart,
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

    function setSearchStart(status: boolean) {
      dispatchQbAction(qbActions.setSearchStart(status));
    }

    function setSearchMethod(method: SEARCH_METHOD) {
      dispatchQbAction(qbActions.setSearchMethod(method));
    }

    function onSearchSubmit() {
      if (isRootSearch) {
        dispatchQbAction(qbActions.submitRootSearch(quranService));
      } else {
        dispatchQbAction(qbActions.submitWordSearch(quranService));
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
          <div className="browser-search-options-checks">
            <Checkbox
              checkboxState={searchDiacritics}
              handleChangeCheckbox={setSearchDiacritics}
              labelText={t("search_diacritics")}
              isDisabled={isRootSearch}
              inputID="CheckboxDiacritics"
            />
            <div className="d-flex">
              <Checkbox
                checkboxState={searchIdentical}
                handleChangeCheckbox={setSearchIdentical}
                labelText={t("search_identical")}
                isDisabled={isRootSearch}
                inputID="CheckboxIdentical"
              />
              <Checkbox
                checkboxState={searchStart}
                handleChangeCheckbox={setSearchStart}
                labelText={t("search_start")}
                isDisabled={isRootSearch}
                inputID="CheckboxStart"
              />
            </div>
          </div>
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
      <span className="browser-search-options-method-text fw-bold">
        {t("search_method")}
      </span>
      <div className="d-flex">
        <div
          className={`form-check ${
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
          className={`form-check  ${
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
          <SearchButton description={t("search_button")} />
        </div>
      </div>
    </form>
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
