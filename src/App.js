import { Routes, Route } from "react-router-dom";

import About from "./components/About";
import QuranBrowser from "./components/QuranBrowser";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuranBrowser />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<QuranBrowser />} />
    </Routes>
  );
}

export default App;
