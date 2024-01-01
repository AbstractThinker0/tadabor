import { Routes, Route } from "react-router-dom";

import { lazy, PropsWithChildren, Suspense } from "react";

const About = lazy(() => import("./pages/About"));
const Coloring = lazy(() => import("./pages/Coloring"));
const QuranBrowser = lazy(() => import("./pages/QuranBrowser"));
const RootsBrowser = lazy(() => import("./pages/RootsBrowser"));
const Translation = lazy(() => import("./pages/Translation"));
const YourNotes = lazy(() => import("./pages/YourNotes"));
const Tags = lazy(() => import("./pages/Tags"));
const Inspector = lazy(() => import("./pages/Inspector"));
const Comparator = lazy(() => import("./pages/Comparator"));
const Searcher = lazy(() => import("./pages/Searcher"));

import LoadingSpinner from "./components/LoadingSpinner";

const Suspenser = ({ children }: PropsWithChildren) => {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspenser>
            <QuranBrowser />
          </Suspenser>
        }
      />
      <Route
        path="/roots"
        element={
          <Suspenser>
            <RootsBrowser />
          </Suspenser>
        }
      />
      <Route
        path="/notes"
        element={
          <Suspenser>
            <YourNotes />
          </Suspenser>
        }
      />
      <Route
        path="/coloring"
        element={
          <Suspenser>
            <Coloring />
          </Suspenser>
        }
      />
      <Route
        path="/translation"
        element={
          <Suspenser>
            <Translation />
          </Suspenser>
        }
      />
      <Route
        path="/tags"
        element={
          <Suspenser>
            <Tags />
          </Suspenser>
        }
      />
      <Route
        path="/inspector"
        element={
          <Suspenser>
            <Inspector />
          </Suspenser>
        }
      />
      <Route
        path="/comparator"
        element={
          <Suspenser>
            <Comparator />
          </Suspenser>
        }
      />
      <Route
        path="/searcher"
        element={
          <Suspenser>
            <Searcher />
          </Suspenser>
        }
      />
      <Route
        path="/about"
        element={
          <Suspenser>
            <About />
          </Suspenser>
        }
      />
      <Route
        path="*"
        element={
          <Suspenser>
            <QuranBrowser />
          </Suspenser>
        }
      />
    </Routes>
  );
}

export default App;
