import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: {
          alert_message: "This is a beta version",
          nav_brand: "Tadabor",
          nav_home: "Home",
          nav_about: "About",
          search_method: "Search method: ",
          search_root: "Root",
          search_word: "Word",
          search_diacritics: "Diacritics",
          search_identical: "Identical",
          search_all_quran: "Search in all chapters",
          search_button: "Search",
          search_count: "Verses count:",
        },
      },
      ar: {
        translation: {
          alert_message:
            "هذه نسخة تجريبيّة من الموقع، الرجاء إبقاء نسخة إحتياط لكل ما تكتبه هنا.",
          nav_brand: "تدبر",
          nav_home: "الرئيسية",
          nav_about: "حول الموقع",
          search_method: "طريقة البحث: ",
          search_root: "جذر",
          search_word: "كلمة",
          search_diacritics: "بالتشكيل",
          search_identical: "مطابق",
          search_all_quran: "بحث في كل السور",
          search_button: "إبحث",
          search_count: "عدد الآيات:",
        },
      },
    },
    lng: "ar", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export default i18n;
