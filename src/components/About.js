function About() {
  return (
    <>
      <div className="text-center" dir="ltr">
        <p>
          Check out the project{" "}
          <a href="https://github.com/EnlightenCode/tadabor">Github repo</a>
        </p>
        <h5>Intro</h5>
        <p>
          This project is a web App that allows you to browse through the Quran
          and write your notes/reflections below the verses, everything will be
          saved in your browser.
        </p>
        <h5>How to use</h5>
        <p>
          Simply go to tadabor.surge.sh and check Quran Browser on the home
          page, you can click the button next to any verse to open a form where
          you can enter your text, once you are done writing you can press the
          save button, all the data will be saved on your browser app and
          clearing your cache might erase the data you have saved.
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

      <p className="text-center text-muted">App Version 0.0.1</p>
    </>
  );
}

export default About;
