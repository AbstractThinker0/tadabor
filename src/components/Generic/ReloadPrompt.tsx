import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";

import { useRegisterSW } from "virtual:pwa-register/react";

const LAST_SW_CHECK_KEY = "lastSWCheck";
const SW_CHECK_INTERVAL_MS = 60 * 60000; // 1 hour
const UPDATE_CHECK_INTERVAL_MS = 10 * 60000; // 10 minute

function ReloadPrompt() {
  const [showPrompt, setShowPrompt] = useState(true);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (r) {
        setInterval(async () => {
          const now = Date.now();
          const lastCheck = Number(
            localStorage.getItem(LAST_SW_CHECK_KEY) || 0
          );

          if (now - lastCheck < SW_CHECK_INTERVAL_MS) {
            console.log(
              `⏳ Last SW check was less than ${
                SW_CHECK_INTERVAL_MS / 60000
              } minutes ago. Skipping...`
            );
            return;
          }

          localStorage.setItem(LAST_SW_CHECK_KEY, String(now));
          console.log("⏱️ Checking for SW update...");

          if (r.installing || !navigator) return;
          if ("connection" in navigator && !navigator.onLine) return;

          try {
            const resp = await fetch(swUrl, {
              cache: "no-store",
              headers: {
                cache: "no-store",
                "cache-control": "no-cache",
              },
            });

            if (resp?.status === 200) {
              console.log("✅ we are online. Attempting update...");
              await r.update();
            }
          } catch (e) {
            console.warn("⚠️ SW update check failed: ", e);
          }
        }, UPDATE_CHECK_INTERVAL_MS);
      }
    },
    onOfflineReady() {
      console.log("📦 App is ready to work offline.");
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const close = () => {
    setShowPrompt(false);
  };

  return (
    <Box dir="ltr" p={0} m={0} w={0} h={0}>
      {needRefresh && showPrompt && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          margin="16px"
          padding="12px"
          border="1px solid #8885"
          borderRadius="4px"
          zIndex="toast"
          textAlign={"left"}
          boxShadow="3px 4px 5px 0 #8885"
          backgroundColor="white"
        >
          <Box marginBottom={"8px"} color={"black"}>
            New version is available, click on reload button to update.
          </Box>
          <Button
            marginRight={"5px"}
            colorPalette={"green"}
            onClick={() => updateServiceWorker()}
          >
            Reload
          </Button>
          <Button bgColor={"gray.300"} color={"black"} onClick={() => close()}>
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ReloadPrompt;
