import { Routes, Route } from "react-router";

import { lazy, Suspense } from "react";

const About = lazy(() => import("@/pages/About"));
const Coloring = lazy(() => import("@/pages/Coloring"));
const QuranBrowser = lazy(() => import("@/pages/QuranBrowser"));
const RootsBrowser = lazy(() => import("@/pages/RootsBrowser"));
const Translation = lazy(() => import("@/pages/Translation"));
const YourNotes = lazy(() => import("@/pages/YourNotes"));
const Tags = lazy(() => import("@/pages/Tags"));
const Inspector = lazy(() => import("@/pages/Inspector"));
const Comparator = lazy(() => import("@/pages/Comparator"));
const Searcher = lazy(() => import("@/pages/Searcher"));
const Searcher2 = lazy(() => import("@/pages/Searcher2"));
const Letters = lazy(() => import("@/pages/Letters"));
const Audio = lazy(() => import("@/pages/Audio"));

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<QuranBrowser />} />
        <Route path="/roots" element={<RootsBrowser />} />
        <Route path="/notes" element={<YourNotes />} />
        <Route path="/coloring" element={<Coloring />} />
        <Route path="/translation" element={<Translation />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/inspector" element={<Inspector />} />
        <Route path="/comparator" element={<Comparator />} />
        <Route path="/searcher" element={<Searcher />} />
        <Route path="/searcher2" element={<Searcher2 />} />
        <Route path="/letters" element={<Letters />} />
        <Route path="/audio" element={<Audio />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<QuranBrowser />} />
      </Routes>
    </Suspense>
  );
};

export default App;
