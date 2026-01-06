import { useEffect } from "react";
import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";

import { useNavigationStore } from "@/store/global/navigationStore";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

const EnableBeta = () => {
  const { t } = useTranslation();

  const setBetaStatus = useNavigationStore((state) => state.setBetaStatus);

  useEffect(() => {
    setBetaStatus(true);
  }, [setBetaStatus]);

  return (
    <>
      <LoadingSpinner text={t("auth.redirecting")} />
      <Navigate to="/" replace />
    </>
  );
};

export default EnableBeta;
