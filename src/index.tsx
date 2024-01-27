import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "@/i18n";

import store from "@/store";
import App from "@/App";

import Layout from "@/components/Layout/Layout";
import DataLoader from "@/components/Custom/DataLoader";

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
