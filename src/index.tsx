import React from "react";
import ReactDOM from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "@/i18n";

import store from "@/store";
import App from "@/App";

import Layout from "@/components/Layout/Layout";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <App />
          </Layout>
        </BrowserRouter>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
