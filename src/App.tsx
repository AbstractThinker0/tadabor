import { Routes, Route } from "react-router-dom";

import { lazy, Suspense } from "react";

const About = lazy(() => import("./pages/About"));
const Coloring = lazy(() => import("./pages/Coloring"));
const QuranBrowser = lazy(() => import("./pages/QuranBrowser"));
const RootsBrowser = lazy(() => import("./pages/RootsBrowser"));
const Translation = lazy(() => import("./pages/Translation"));
const YourNotes = lazy(() => import("./pages/YourNotes"));
const Tags = lazy(() => import("./pages/Tags"));
const Inspector = lazy(() => import("./pages/Inspector"));
const Comparator = lazy(() => import("./pages/Comparator"));

import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <QuranBrowser />
          </Suspense>
        }
      />
      <Route
        path="/roots"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <RootsBrowser />
          </Suspense>
        }
      />
      <Route
        path="/notes"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <YourNotes />
          </Suspense>
        }
      />
      <Route
        path="/coloring"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Coloring />
          </Suspense>
        }
      />
      <Route
        path="/translation"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Translation />
          </Suspense>
        }
      />
      <Route
        path="/tags"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Tags />
          </Suspense>
        }
      />
      <Route
        path="/inspector"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Inspector />
          </Suspense>
        }
      />
      <Route
        path="/comparator"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Comparator />
          </Suspense>
        }
      />
      <Route
        path="/about"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <About />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <QuranBrowser />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
