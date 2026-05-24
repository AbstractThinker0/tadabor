import { LoadingSpinner } from "@/components/Generic/LoadingSpinner";
import { useCloudNotesSync } from "@/hooks/useCloudNotesSync";
import { type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

const CloudNotesProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const { isLogged, isCloudNotesReady } = useCloudNotesSync();

  if (isLogged && !isCloudNotesReady) {
    return <LoadingSpinner text={t("ui.state.loading_cloud_notes")} />;
  }

  return <>{children}</>;
};

export { CloudNotesProvider };
