import { Navigate } from "react-router";

import { useAppSelector } from "@/store";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { isBackendEnabled } from "@/util/util";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { t } = useTranslation();

  const isLogged = useAppSelector((state) => state.user.isLogged);

  const isPending = useAppSelector((state) => state.user.isPending);

  if (!isBackendEnabled()) {
    return (
      <>
        <Navigate to="/" replace />
      </>
    );
  }

  if (isPending) {
    return <LoadingSpinner text={t("auth.checking")} />;
  }

  if (isLogged) {
    return (
      <>
        <LoadingSpinner text={t("auth.redirecting")} />
        <Navigate to="/" replace />
      </>
    );
  }

  return <>{children}</>;
};

export default GuestRoute;
