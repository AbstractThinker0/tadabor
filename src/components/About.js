import { useTranslation } from "react-i18next";

const APP_VERSION = "0.0.6";

function About() {
  const { i18n } = useTranslation();

  if (i18n.resolvedLanguage === "en") {
    return <AboutEnglish />;
  }

  return <AboutArabic />;
}

const AboutEnglish = () => {
  return (
    <>
      <div className="pt-4 card" dir="ltr">
        <p className="text-center">
          Check out the project{" "}
          <a href="https://github.com/EnlightenCode/tadabor">Github repo</a>
        </p>
        <div className="card-body">
          <h5>Intro</h5>
          <p>
            This project is a web App that allows you to browse through the
            Quran and write your notes/reflections below the verses, everything
            will be saved in your browser.
          </p>
          <h5>How to use</h5>
          <p>
            Simply go to tadabor.surge.sh and check Quran Browser on the home
            page, you can click the button next to any verse to open a form
            where you can enter your text, once you are done writing you can
            press the save button, all the data will be saved on your browser
            app and clearing your cache might erase the data you have saved.
          </p>
          <h5>Credits</h5>
          <br />
          <ul>
            <li className="fw-bold">
              The creator of the universe for all his favors that if I tried to
              count I would never be able to number them
            </li>
            <br />
            <li>
              <a
                href="https://github.com/risan/quran-json"
                target="_blank"
                rel="noreferrer"
              >
                quran-json
              </a>{" "}
              project for the compilation of chapter names and their
              transliteration
            </li>
            <li>
              Credits Tanzil project for the Quran text compilation ( Check the
              bottom of /public/res/quran-simple-plain.txt )
            </li>

            <li>
              Computer Research Center of Islamic Sciences (noorsoft.org) and
              Tanzil Project (tanzil.info) and Zekr Project (zekr.org) for the
              Quran roots compilation ( Check the bottom of
              /public/res/quran-root.txt ){" "}
            </li>
          </ul>
        </div>
      </div>

      <p className="text-center text-muted">App Version {APP_VERSION}</p>
    </>
  );
};

const AboutArabic = () => {
  return (
    <>
      <div className="pt-4 card" dir="rtl">
        <p className="text-center">
          إطلع على موقع البرنامج في{" "}
          <a href="https://github.com/EnlightenCode/tadabor">Github</a>
        </p>
        <div className="card-body">
          <h5>تقديم</h5>
          <p>
            هذا التطبيق هو موقع يخول المستخدم من تصفح القرآن وكتابة تدبرات أو
            ملاحظات تحت الآيات، كل ما يكتب يتم تسجيله في متصفحك.
          </p>
          <h5>كيفية الإستخدام</h5>
          <p>
            اذهب الى tadabor.surge.sh ثم قم بتجربة متصفح القرآن في الصفحة
            الرئيسية، يمكنك الضغط على الزر المحاذي لأي آية حتى تظهر لك خانة
            الكتابة، وحين تنتهي من الكتابة يمكنك الضغط على زر الحفظ، كل البيانات
            يتم تسجيلها في متصفحك وحذف سجل المتصفح قد يحذف أي بيانات قمت
            بتسجيلها هنا.
          </p>
          <h5>الشكر</h5>
          <br />
          <ul>
            <li className="fw-bold">
              خالق الكون لنعمه التي إن حاولت أن أحصيها فلن أعدها
            </li>
            <br />
            <li>
              <a
                href="https://github.com/risan/quran-json"
                target="_blank"
                rel="noreferrer"
              >
                quran-json
              </a>{" "}
              لتجميع أسماء سور مع ترجمتها
            </li>
            <li>
              الشكر إلى Tanzil project لنص القرآن الإلكتروني ( أنظر في آخر
              /public/res/quran-simple-plain.txt )
            </li>

            <li>
              الشكر إلى Computer Research Center of Islamic Sciences
              (noorsoft.org) و Tanzil Project (tanzil.info) و Zekr Project
              (zekr.org) لملف جذور القرآن الإلكتروني ( أنظر إلى آخر
              /public/res/quran-root.txt ){" "}
            </li>
          </ul>
        </div>
      </div>

      <p className="text-center text-muted">نسخة التطبيق {APP_VERSION}</p>
    </>
  );
};

export default About;
