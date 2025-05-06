import React from "react";
import ReactDOM from "react-dom/client";

import { ErrorBoundary } from "react-error-boundary";

import "@/i18n";

import App from "@/App";

import Layout from "@/components/Layout/Layout";

import AppProviders from "@/components/Custom/AppProviders";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppProviders>
      <Layout>
        <ErrorBoundary fallback={<div>Couldn't load the page.</div>}>
          <App />
        </ErrorBoundary>
      </Layout>
    </AppProviders>
  </React.StrictMode>
);
