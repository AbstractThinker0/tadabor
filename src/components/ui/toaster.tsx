"use client";

import { createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
});

export const toasterBottomCenter = createToaster({
  placement: "bottom",
  pauseOnPageIdle: true,
});
