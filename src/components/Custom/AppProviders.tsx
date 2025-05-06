import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

import { ErrorBoundary } from "react-error-boundary";

import store from "@/store";

import { QueryProvider } from "@/components/Custom/QueryProvider";

import { UIProvider } from "@/components/ui/provider";
import { Toaster, ToasterBottom } from "@/components/ui/ToasterProvider";

import ReloadPrompt from "@/components/Generic/ReloadPrompt";

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <UIProvider>
      <Toaster />
      <ToasterBottom />
      <ReloadPrompt />
      <ErrorBoundary fallback={<div>Couldn't load the app.</div>}>
        <QueryProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </QueryProvider>
      </ErrorBoundary>
    </UIProvider>
  </Provider>
);

export default AppProviders;
