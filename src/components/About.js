function About() {
  return (
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
        How to use Simply go to tadabor.surge.sh and check Quran Browser on the
        home page, you can click the down arrow next to any verse to open a form
        where you can enter your text, once you are done writing you can press
        the save button, all the data will be saved on your browser app, so
        using a different browser may or clearing your cache will erase the data
        you have saved.
      </p>
      <h5>Credits</h5>
      <ul>
        <li>
          quran-json project for the compilation of chapter names and their
          transliteration
        </li>
        <li>
          Credits Tanzil project for their Quran translation ( Check the bottom
          /public/res/quran-simple-plain.txt )
        </li>

        <li>
          Computer Research Center of Islamic Sciences (noorsoft.org) and Tanzil
          Project (tanzil.info) and Zekr Project (zekr.org) for the Quran roots
          compilation ( Check the bottom /public/res/quran-root.txt ){" "}
        </li>
      </ul>
    </div>
  );
}

export default About;
