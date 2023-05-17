import React from "react";
import ReactDOM from "react-dom/client";

import store from "./store";
import { Provider } from "react-redux";

import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import App from "./App";

import "./i18n";
import DataLoader from "./components/DataLoader";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <DataLoader>
            <App />
          </DataLoader>
        </Layout>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
