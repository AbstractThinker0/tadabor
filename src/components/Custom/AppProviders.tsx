import { BrowserRouter } from "react-router";

import { ErrorBoundary } from "react-error-boundary";

import { QueryProvider } from "@/components/Custom/QueryProvider";

import { UIProvider } from "@/components/ui/provider";
import { Toaster, ToasterBottom } from "@/components/ui/ToasterProvider";

import ReloadPrompt from "@/components/Generic/ReloadPrompt";

const AppProviders = ({ children }: { children: React.ReactNode }) => (
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
);

export default AppProviders;
