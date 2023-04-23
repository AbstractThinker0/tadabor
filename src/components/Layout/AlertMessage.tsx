import { useState } from "react";
import { useTranslation } from "react-i18next";

const AlertMessage = () => {
  const localStorageBetaKey = "betaNotified";

  const [betaNotified, setBetaNotified] = useState(
    localStorage.getItem(localStorageBetaKey) !== null
  );
  const { t } = useTranslation();

  function onClickClose() {
    localStorage.setItem(localStorageBetaKey, "true");
    setBetaNotified(true);
  }

  if (betaNotified) return <></>;

  return (
    <div
      className="alert alert-warning alert-dismissible fade show d-flex justify-content-center m-0"
      role="alert"
    >
      {t("alert_message")}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClickClose}
      ></button>
    </div>
  );
};

export default AlertMessage;
