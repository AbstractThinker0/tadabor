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
          nav_inspector: "Inspector",
          nav_comparator: "Comparator",
          nav_searcher: "Searcher",
          nav_searcher2: "Searcher 2",
          nav_letters: "Letters",
          nav_audio: "Audio",
          nav_anagrams: "Anagrams",
          search_method: "Search method: ",
          search_root: "Root",
          search_word: "Word",
          search_diacritics: "Diacritics",
          search_identical: "Identical",
          search_start: "Identical Start",
          search_all_quran: "Search in all chapters",
          search_button: "Search",
          search_count: "Verses count:",
          search_fail: "This word doesn't exist.",
          search_root_error: "This root doesn't exist or not registred.",
          search_result: "Search results for",
          search_chapters_all: "in all chapters",
          search_chapters: "in chapters:",
          text_edit: "Edit",
          text_save: "Save",
          save_success: "Successfuly saved.",
          save_failed: "Failed to save",
          no_notes: "You don't have any notes saved to be shown here.",
          word: "word",
          root: "root",
          select_all: "Select all",
          deselect_all: "Deselect all",
          all_chapters: "All chapters",
          current_chapter: "Current chapter",
          search_scope: "Search scope",
          select_notice:
            "You have to select at least one chapter to initiate a search.",
          text_form: "Enter your text",
          search_options: "Search options: ",
          derivations: "Derivations",
          search_inclusive: "Inclusive",
          notes_verses: "Verses notes",
          notes_roots: "Roots notes",
          notes_trans: "Translation",
          searcher_search: "Search",
          panel_definitions: "Definitions",
          panel_display: "Display",
          letters_preset: "Preset:",
          about: {
            introTitle: "Intro:",
            introText:
              "This project is a web App that allows you to browse through the Quran and write your notes/reflections below the verses, everything will be saved in your browser.",
            howToUseTitle: "How to use:",
            howToUseText:
              "Simply go to Quran Browser from the navigation menu, you can click the button next to any verse to open a form where you can enter your text, once you are done writing you can press the save button, all the data will be saved on your browser app and clearing your cache might erase the data you have saved.",
            disclaimerTitle: "Disclaimer:",
            disclaimerText:
              "The app is in beta, which means you may encounter occasional bugs. We strongly recommend keeping a backup of any data you save while using the app. Please be aware that the accuracy of the Quran roots list has not been extensively verified.",
            creditsTitle: "Credits:",
            credit1:
              "The creator of the universe for all his favors that if I tried to count I would never be able to number them",
            credit2:
              "Tanzil project for the Quran text compilation (tanzil.net)",
            credit3:
              "Initial quran roots compilation extracted from Zekr Project (zekr.org)",
            credit4: "Chapter names and their transliteration extracted from",
            githubText: "Check out the project on",
            appVersion: "App Version",
          },
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
          nav_inspector: "المتفحِّص",
          nav_comparator: "المقارن",
          nav_searcher: "باحث",
          nav_searcher2: "باحث 2",
          nav_letters: "الحروف",
          nav_audio: "قارئ",
          nav_anagrams: "تقاليب",
          search_method: "طريقة البحث: ",
          search_root: "جذر",
          search_word: "كلمة",
          search_diacritics: "بالتشكيل",
          search_identical: "مطابق",
          search_start: "مطابق للبداية",
          search_all_quran: "بحث في كل السور",
          search_button: "إبحث",
          search_count: "عدد الآيات:",
          search_fail: "لا وجود لهذه الكلمة.",
          search_root_error: "هذا الجذر غير موجود أو غير مدرج.",
          search_result: "نتائج البحث عن",
          search_chapters_all: "في كل السور",
          search_chapters: "في سور:",
          text_edit: "تعديل",
          text_save: "حفظ",
          save_success: "تم الحفظ.",
          save_failed: "فشلت عملية الحفظ.",
          no_notes: "ليس لديك أي كتابات لإظهارها هنا.",
          word: "كلمة",
          root: "جذر",
          select_all: "تحديد الكل",
          deselect_all: "إلغاء تحديد الكل",
          all_chapters: "كل السور",
          current_chapter: "السورة الحالية",
          search_scope: "نطاق البحث",
          select_notice: "يجب عليك اختيار سورة واحدة على الأقل لبدء البحث.",
          text_form: "أدخل كتاباتك",
          search_options: "خيارات البحث: ",
          derivations: "الإشتقاقات",
          search_inclusive: "شامل",
          notes_verses: "آيات",
          notes_roots: "جذور",
          notes_trans: "ترجمة",
          searcher_search: "بحث",
          panel_definitions: "التعريفات",
          panel_display: "العرض",
          letters_preset: "مجموعة:",
          about: {
            introTitle: "تقديم:",
            introText:
              "هذا التطبيق هو موقع يخول المستخدم من تصفح القرآن وكتابة تدبرات أو ملاحظات تحت الآيات، كل ما يكتب يتم تسجيله في متصفحك.",
            howToUseTitle: "كيفية الإستخدام:",
            howToUseText:
              "إنتقل إلى متصفح القرآن عبر قائمة التطبيق ثم يمكنك الضغط على الزر المحاذي لأي آية حتى تظهر لك خانة الكتابة، وحين تنتهي من الكتابة يمكنك الضغط على زر الحفظ، كل البيانات يتم تسجيلها في متصفحك وحذف سجل المتصفح قد يحذف أي بيانات قمت بتسجيلها هنا.",
            disclaimerTitle: "إخلاء مسؤولية:",
            disclaimerText:
              "التطبيق في مرحلة تجريبية، مما يعني أنه قد تواجه أحيانًا بعض الأخطاء. نوصي بشدة بأن تقوم بعمل نسخ احتياطية لأي بيانات تقوم بحفظها أثناء استخدام التطبيق. يُرجى ملاحظة أن دقة قائمة جذور/أوزان القرآن لم تتم التحقق منها بشكل مكثّف.",
            creditsTitle: "الشكر:",
            credit1: "خالق الكون لنعمه التي إن حاولت أن أحصيها فلن أعدها",
            credit2: "نص القرآن الإلكتروني أخذ من Tanzil project (tanzil.net)",
            credit3:
              "ملف جذور القرآن الإلكتروني قبل التعديل أخذ من Zekr Project (zekr.org)",
            credit4: "ملف أسماء السور مع ترجمتها أخذ من",
            githubText: "رابط التطبيق على",
            appVersion: "نسخة التطبيق",
          },
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
