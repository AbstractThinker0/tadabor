import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import useQuran from "@/context/useQuran";

import SelectionListChapters from "@/components/Pages/QuranBrowser/SelectionListChapters";
import SelectionListRoots from "@/components/Pages/QuranBrowser/SelectionListRoots";

import { SEARCH_METHOD } from "@/components/Pages/QuranBrowser/consts";

import { SearchButton } from "@/components/Generic/Buttons";

import Checkbox from "@/components/Custom/Checkbox";

const SearchPanel = () => {
  const quranService = useQuran();
  const { t } = useTranslation();

  const searchMethod = useAppSelector((state) => state.qbPage.searchMethod);

  const searchDiacritics = useAppSelector(
    (state) => state.qbPage.searchDiacritics
  );

  const searchIdentical = useAppSelector(
    (state) => state.qbPage.searchIdentical
  );

  const searchStart = useAppSelector((state) => state.qbPage.searchStart);

  const searchString = useAppSelector((state) => state.qbPage.searchString);

  const dispatch = useAppDispatch();

  const isRootSearch = searchMethod === SEARCH_METHOD.ROOT ? true : false;

  function setSearchDiacritics(status: boolean) {
    dispatch(qbPageActions.setSearchDiacritics(status));
  }

  function setSearchIdentical(status: boolean) {
    dispatch(qbPageActions.setSearchIdentical(status));
  }

  function setSearchStart(status: boolean) {
    dispatch(qbPageActions.setSearchStart(status));
  }

  function setSearchMethod(method: SEARCH_METHOD) {
    dispatch(qbPageActions.setSearchMethod(method));
  }

  function onSearchSubmit() {
    if (isRootSearch) {
      dispatch(qbPageActions.submitRootSearch({ quranInstance: quranService }));
    } else {
      dispatch(qbPageActions.submitWordSearch({ quranInstance: quranService }));
    }
  }

  const handleCurrentChapter = (chapterID: number) => {
    dispatch(qbPageActions.gotoChapter(chapterID.toString()));
  };

  return (
    <div className="browser-search">
      <SelectionListChapters handleCurrentChapter={handleCurrentChapter} />
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
      />
      <SelectionListRoots
        isDisabled={!isRootSearch}
        searchString={searchString}
      />
      <SearchSuccessComponent />
    </div>
  );
};

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
}

const FormWordSearch = ({
  onSearchSubmit,
  searchString,
}: FormWordSearchProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const searchStringHandle = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(qbPageActions.setSearchString(event.target.value));
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

const SearchSuccessComponent = () => {
  const { t } = useTranslation();
  const searchResult = useAppSelector((state) => state.qbPage.searchResult);

  return (
    <>
      {searchResult.length > 0 && (
        <div className="fw-bold text-success">
          {`${t("search_count")} ${searchResult.length}`}
        </div>
      )}
    </>
  );
};

export default SearchPanel;
