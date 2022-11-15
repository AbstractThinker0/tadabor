import React from "react";
import { Routes, Route } from "react-router-dom";

import About from "./pages/About";
import Coloring from "./pages/Coloring";
import QuranBrowser from "./pages/QuranBrowser";
import RootsBrowser from "./pages/RootsBrowser";
import Translation from "./pages/Translation";
import YourNotes from "./pages/YourNotes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuranBrowser />} />
      <Route path="/roots" element={<RootsBrowser />} />
      <Route path="/notes" element={<YourNotes />} />
      <Route path="/coloring" element={<Coloring />} />
      <Route path="/translation" element={<Translation />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<QuranBrowser />} />
    </Routes>
  );
}

export default App;
