import { useEffect } from "react";
import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

const EnableBeta = () => {
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.setItem("betaVersion", "true");
  }, []);

  return (
    <>
      <LoadingSpinner text={t("auth.redirecting")} />
      <Navigate to="/" replace />
    </>
  );
};

export default EnableBeta;
