import { useTranslation } from "react-i18next";

const LanguageButton = () => {
  const { i18n } = useTranslation();
  const resolvedLang = i18n.resolvedLanguage;

  const onLangClick = () => {
    resolvedLang === "en"
      ? i18n.changeLanguage("ar")
      : i18n.changeLanguage("en");
  };
  return (
    <div className={`d-flex ${resolvedLang === "ar" && "me-auto"}`}>
      <button className="btn btn-light" onClick={onLangClick}>
        {resolvedLang === "en" ? "العربية" : "English"}
      </button>
    </div>
  );
};

export default LanguageButton;
