"use client";

import { createToaster } from "@chakra-ui/react";

type ToastType = "success" | "error" | "info" | "loading";

const withConvenienceMethods = <T extends ReturnType<typeof createToaster>>(
  toasterInstance: T
) => {
  const notify = (type: ToastType, description: string) => {
    toasterInstance.create({ description, type });
  };

  return Object.assign(toasterInstance, {
    success: (description: string) => notify("success", description),
    error: (description: string) => notify("error", description),
    info: (description: string) => notify("info", description),
    loading: (description: string) => notify("loading", description),
  });
};

export const toaster = withConvenienceMethods(
  createToaster({
    placement: "top-end",
    pauseOnPageIdle: true,
  })
);

export const toasterBottomCenter = withConvenienceMethods(
  createToaster({
    placement: "bottom",
    pauseOnPageIdle: true,
  })
);
