import { useTranslation } from "react-i18next";

const AboutEnglish = () => {
  return (
    <>
      <div className="pt-4 card about-card" dir="ltr">
        <p className="text-center">
          Check out the project's{" "}
          <a
            href="https://github.com/AbstractThinker0/tadabor"
            target="_blank"
            rel="noreferrer"
          >
            Github repository
          </a>
        </p>
        <div className="card-body">
          <h5>Intro:</h5>
          <p>
            This project is a web App that allows you to browse through the
            Quran and write your notes/reflections below the verses, everything
            will be saved in your browser.
          </p>
          <h5>How to use:</h5>
          <p>
            Simply go to Quran Browser on the home page, you can click the
            button next to any verse to open a form where you can enter your
            text, once you are done writing you can press the save button, all
            the data will be saved on your browser app and clearing your cache
            might erase the data you have saved.
          </p>
          <h5>Disclaimer:</h5>
          <p>
            The app is in beta, which means you may encounter occasional bugs.
            We strongly recommend keeping a backup of any data you save while
            using the app. Your data is stored locally on your machine and is
            never transmitted or stored on a remote database. However, it's
            always a good practice to have a backup. Please be aware that the
            accuracy of the Quran roots/stems list has not been verified, and
            the completeness of search results based on sentences/roots has not
            been extensively tested.
          </p>
          <h5>Credits:</h5>
          <ul>
            <li className="fw-bold">
              The creator of the universe for all his favors that if I tried to
              count I would never be able to number them
            </li>
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
            <li>Tanzil project for the Quran text compilation</li>

            <li>
              Computer Research Center of Islamic Sciences (noorsoft.org) and
              Tanzil Project (tanzil.info) and Zekr Project (zekr.org) for the
              Quran roots compilation
            </li>
          </ul>
          <h5>Future project:</h5>
          <p>
            Once all features of this project are implemented, it will serve as
            the foundation for another project that aims to create a platform
            for collaborative translation and reflection upon the Quran. The
            ultimate goal is to achieve an accurate understanding of the true
            message of the Quran by undoing all the semantic changes that have
            occurred over the centuries. There is currently no set deadline, and
            it all depends on God's will.
          </p>
        </div>
      </div>

      <p className="text-center text-muted">App Version {APP_VERSION}</p>
    </>
  );
};

const AboutArabic = () => {
  return (
    <>
      <div className="pt-4 card about-card" dir="rtl">
        <p className="text-center">
          إطلع على موقع البرنامج في{" "}
          <a
            href="https://github.com/AbstractThinker0/tadabor"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </p>
        <div className="card-body">
          <h5>تقديم:</h5>
          <p>
            هذا التطبيق هو موقع يخول المستخدم من تصفح القرآن وكتابة تدبرات أو
            ملاحظات تحت الآيات، كل ما يكتب يتم تسجيله في متصفحك.
          </p>
          <h5>كيفية الإستخدام:</h5>
          <p>
            اذهب الى متصفح القرآن في الصفحة الرئيسية، يمكنك الضغط على الزر
            المحاذي لأي آية حتى تظهر لك خانة الكتابة، وحين تنتهي من الكتابة
            يمكنك الضغط على زر الحفظ، كل البيانات يتم تسجيلها في متصفحك وحذف سجل
            المتصفح قد يحذف أي بيانات قمت بتسجيلها هنا.
          </p>
          <h5>إخلاء مسؤولية:</h5>
          <p>
            التطبيق في مرحلة تجريبية، مما يعني أنه قد تواجه أحيانًا بعض الأخطاء.
            نوصي بشدة بأن تقوم بعمل نسخ احتياطية لأي بيانات تقوم بحفظها أثناء
            استخدام التطبيق. تُخزن البيانات على جهازك ولا تُرسل أو تُخزن على
            قاعدة بيانات خارجيّة. ومع ذلك، فإن وجود نسخة احتياطية دائمًا أمر
            جيد. يُرجى ملاحظة أن دقة قائمة جذور/أوزان القرآن لم تتم التحقق منها،
            ولم يتم اختبار كمالية نتائج البحث بناءً على الجمل/الجذور بشكل مكثف.
          </p>
          <h5>الشكر:</h5>

          <ul>
            <li className="fw-bold">
              خالق الكون لنعمه التي إن حاولت أن أحصيها فلن أعدها
            </li>
            <li>
              <a
                href="https://github.com/risan/quran-json"
                target="_blank"
                rel="noreferrer"
              >
                quran-json
              </a>{" "}
              لتجميع أسماء السور مع ترجمتها
            </li>
            <li>Tanzil project لنص القرآن الإلكتروني</li>

            <li>
              Computer Research Center of Islamic Sciences (noorsoft.org) و
              Tanzil Project (tanzil.info) و Zekr Project (zekr.org) لملف جذور
              القرآن الإلكتروني
            </li>
          </ul>
          <h5>المشروع المقبل:</h5>
          <p>
            بمجرد اكتمال هذا المشروع الحالي، سيتم إستخدامه كأساس لمشروع آخر يهدف
            إلى أن يكون منصة تشاركية لترجمة وتدبر القرآن، والهدف تحقيق فهم دقيق
            للرسالة الحقيقية للقرآن عن طريق التراجع عن كل التغييرات الدلالية
            التي حدثت على مر القرون، لم يتم تحديد موعد نهائي للمشروع، وكل شيء
            يعتمد على مشيئة الله.
          </p>
        </div>
      </div>

      <p className="text-center text-muted">نسخة التطبيق {APP_VERSION}</p>
    </>
  );
};

function About() {
  const { i18n } = useTranslation();

  if (i18n.resolvedLanguage === "en") {
    return <AboutEnglish />;
  }

  return <AboutArabic />;
}

export default About;
