import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import "./i18n";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <App />
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);
