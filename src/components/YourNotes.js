import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

import { db } from "../util/db";
import axios from "axios";

function YourNotes() {
  const [loadingState, setLoadingState] = useState(true);
  const [chapterNames, setChapterNames] = useState([]);
  const [myNotes, setMyNotes] = useState({});

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userNotes = await db.notes.toArray();

      if (clientLeft) return;

      let extractNotes = {};
      userNotes.forEach((note) => {
        extractNotes[note.id] = note.text;
      });

      setMyNotes(extractNotes);

      const response = await axios.get("/res/chapters.json");

      if (clientLeft) return;

      setChapterNames(response.data);

      setLoadingState(false);
    }

    return () => {
      clientLeft = true;
    };
  }, []);

  if (loadingState) return <LoadingSpinner />;

  return <YourNotesLoaded myNotes={myNotes} chapterNames={chapterNames} />;
}

const YourNotesLoaded = ({ myNotes, chapterNames }) => {
  const convertKey = (key) => {
    let info = key.split("-");
    return chapterNames[info[0] - 1].name + ":" + info[1];
  };

  return (
    <div className="pt-2 pb-2">
      {Object.keys(myNotes).map((key) => (
        <div key={key} className="card mb-3">
          <div className="card-header">{convertKey(key)}</div>
          <div className="card-body">
            <p style={{ whiteSpace: "pre-wrap" }}>{myNotes[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YourNotes;
