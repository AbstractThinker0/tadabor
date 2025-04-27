import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

import "@/i18n";

import store from "@/store";
import App from "@/App";

import Layout from "@/components/Layout/Layout";
import { QueryProvider } from "@/components/Custom/QueryProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <BrowserRouter>
          <Layout>
            <App />
          </Layout>
        </BrowserRouter>
      </QueryProvider>
    </Provider>
  </React.StrictMode>
);
