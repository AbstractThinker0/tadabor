import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";

import { useRegisterSW } from "virtual:pwa-register/react";

const LAST_SW_CHECK_KEY = "lastSWCheck";
const SW_CHECK_INTERVAL_MS = 120 * 60000; // 2 hours
const UPDATE_CHECK_INTERVAL_MS = 15 * 60000; // 15 minute

function ReloadPrompt() {
  const [showPrompt, setShowPrompt] = useState(true);
  const [updatePending, setUpdatePending] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (r) {
        //
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

          if ("connection" in navigator && !navigator.onLine) {
            console.log("⚠️ No connection, Can't check for updates.");
            return;
          }

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

  const onClickReload = () => {
    updateServiceWorker();
    setUpdatePending(true);
  };

  const onClickClose = () => {
    setShowPrompt(false);
  };

  return (
    <Box dir="ltr" p={0} m={0} w={0} h={0}>
      {needRefresh && showPrompt && (
        <Box
          position="fixed"
          bottom="0"
          left="50%"
          transform="translateX(-50%)"
          margin="16px"
          padding="12px"
          border="1px solid"
          borderColor={"border"}
          borderRadius="4px"
          zIndex="toast"
          textAlign={"left"}
          boxShadow="md"
          color={"fg"}
          backgroundColor="bg"
        >
          {updatePending ? (
            <Box marginBottom={"8px"}>
              Reloading the page to apply updates..
            </Box>
          ) : (
            <>
              <Box marginBottom={"8px"}>
                New version available. Save your notes and reload.
              </Box>

              <Button
                marginRight={"5px"}
                colorPalette={"green"}
                onClick={onClickReload}
              >
                Reload
              </Button>
              <Button
                bgColor={"gray.300"}
                color={"black"}
                onClick={onClickClose}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}

export default ReloadPrompt;
