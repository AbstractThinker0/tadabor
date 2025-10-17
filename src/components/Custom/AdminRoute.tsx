import { Navigate } from "react-router";

import { useAppSelector } from "@/store";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { useTranslation } from "react-i18next";

interface AdminRouteProps {
  children: React.ReactNode;
  minRole?: number; // default 1
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, minRole = 1 }) => {
  const { t } = useTranslation();

  const isLogged = useAppSelector((state) => state.user.isLogged);
  const isPending = useAppSelector((state) => state.user.isPending);
  const role = useAppSelector((state) => state.user.role);

  if (isPending) {
    return <LoadingSpinner text={t("auth.attemptingLogin")} />;
  }

  if (!isLogged || role === null || role === undefined || role < minRole) {
    return (
      <>
        <LoadingSpinner text={t("auth.redirecting")} />
        <Navigate to="/" replace />
      </>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
