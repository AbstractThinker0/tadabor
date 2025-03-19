import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CloseButton, Alert } from "@chakra-ui/react";

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
    <Alert.Root
      dir="auto"
      status="warning"
      alignItems={"center"}
      fontSize={"xl"}
    >
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{t("alert_message")}</Alert.Title>
      </Alert.Content>

      <CloseButton onClick={onClickClose} />
    </Alert.Root>
  );
};

export default AlertMessage;
