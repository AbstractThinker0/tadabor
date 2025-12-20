import { useEffect } from "react";
import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/store";
import { navigationActions } from "@/store/slices/global/navigation";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

const EnableBeta = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(navigationActions.setBetaStatus(true));
  }, [dispatch]);

  return (
    <>
      <LoadingSpinner text={t("auth.redirecting")} />
      <Navigate to="/" replace />
    </>
  );
};

export default EnableBeta;
