import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Alert, AlertIcon, CloseButton, Spacer } from "@chakra-ui/react";

const AlertMessage = () => {
  const { t } = useTranslation();

  const localStorageBetaKey = "betaNotified";

  const [betaNotified, setBetaNotified] = useState(
    localStorage.getItem(localStorageBetaKey) !== null
  );

  function onClickClose() {
    localStorage.setItem(localStorageBetaKey, "true");
    setBetaNotified(true);
  }

  if (betaNotified) return null;

  return (
    <Alert status="warning">
      <AlertIcon />
      {t("alert_message")}
      <Spacer />
      <CloseButton onClick={onClickClose} />
    </Alert>
  );
};

export default AlertMessage;
