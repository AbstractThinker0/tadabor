import { Routes, Route } from "react-router-dom";

import About from "./components/About";
import Coloring from "./components/Coloring";
import QuranBrowser from "./components/QuranBrowser";
import RootsBrowser from "./components/RootsBrowser";
import YourNotes from "./components/YourNotes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuranBrowser />} />
      <Route path="/roots" element={<RootsBrowser />} />
      <Route path="/notes" element={<YourNotes />} />
      <Route path="/coloring" element={<Coloring />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<QuranBrowser />} />
    </Routes>
  );
}

export default App;
