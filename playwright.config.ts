import { defineConfig } from "@playwright/test";

import { basePlaywrightConfig, createFrontendWebServer } from "./playwright.shared";

export default defineConfig({
  ...basePlaywrightConfig,
  testIgnore: "**/*-backend.spec.ts",
  webServer: createFrontendWebServer({ port: 4173 }),
});
