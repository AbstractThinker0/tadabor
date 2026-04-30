import { BrowserRouter } from "react-router";

import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import { QueryProvider } from "@/components/Custom/QueryProvider";

import { UIProvider } from "@/components/ui/provider";
import { Toaster, ToasterBottom } from "@/components/ui/ToasterProvider";

import { ReloadPrompt } from "@/components/Generic/ReloadPrompt";

const AppFallback = () => {
  const { t, i18n } = useTranslation();

  return <div dir={i18n.dir()}>{t("ui.state.failed_load_app")}</div>;
};

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <UIProvider>
    <Toaster />
    <ToasterBottom />
    <ReloadPrompt />
    <ErrorBoundary fallback={<AppFallback />}>
      <QueryProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  </UIProvider>
);

export { AppProviders };
