import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

if (localStorage.getItem("i18nextLng") === null) {
  localStorage.setItem("i18nextLng", "ar");
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: {
          alert_message:
            "This is a beta version of the website, please make sure to have a backup of everything you save here.",
          nav_brand: "Tadabor",
          nav_browser: "Browser",
          nav_about: "About",
          nav_roots: "Roots",
          nav_notes: "Your notes",
          nav_coloring: "Coloring",
          nav_translation: "Translation",
          nav_tags: "Tags",
          search_method: "Search method: ",
          search_root: "Root",
          search_word: "Word",
          search_diacritics: "Diacritics",
          search_identical: "Identical",
          search_all_quran: "Search in all chapters",
          search_button: "Search",
          search_count: "Verses count:",
          search_fail: "This word doesn't exist.",
          search_root_error: "This root doesn't exist or not registred.",
          text_edit: "Edit",
          text_save: "Save",
          save_success: "Successfuly saved the changes.",
          save_failed: "Failed to save the changes",
          roots_list: "Surahs list:",
        },
      },
      ar: {
        translation: {
          alert_message:
            "هذه نسخة تجريبيّة من الموقع، الرجاء إبقاء نسخة إحتياط لكل ما تكتبه هنا.",
          nav_brand: "تدبر",
          nav_browser: "المتصفح",
          nav_about: "حول الموقع",
          nav_roots: "الجذور",
          nav_notes: "كتاباتك",
          nav_coloring: "تلوين",
          nav_translation: "الترجمة",
          nav_tags: "العناوين",
          search_method: "طريقة البحث: ",
          search_root: "جذر",
          search_word: "كلمة",
          search_diacritics: "بالتشكيل",
          search_identical: "مطابق",
          search_all_quran: "بحث في كل السور",
          search_button: "إبحث",
          search_count: "عدد الآيات:",
          search_fail: "لا وجود لهذه الكلمة.",
          search_root_error: "هذا الجذر غير موجود أو غير مدرج.",
          text_edit: "تعديل",
          text_save: "حفظ",
          save_success: "تم الحفظ بنجاح.",
          save_failed: "فشلت عملية الحفظ.",
          roots_list: "قائمة السور:",
        },
      },
    },
    //lng: "ar", // if you're using a language detector, do not define the lng option
    fallbackLng: "ar",
    supportedLngs: ["ar", "en"],

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export default i18n;
