import { defineConfig } from "@playwright/test";

import {
  PLAYWRIGHT_ALLOWED_FRONTEND_ORIGINS,
  PLAYWRIGHT_BACKEND_ORIGIN,
  PLAYWRIGHT_BACKEND_PORT,
  PLAYWRIGHT_BACKEND_RPC_URL,
  PLAYWRIGHT_CAPTCHA_BYPASS_CODE,
  PLAYWRIGHT_FRONTEND_ORIGIN,
  PLAYWRIGHT_FRONTEND_PORT,
} from "./tests/helpers/backendConfig";
import {
  backendRoot,
  basePlaywrightConfig,
  createFrontendWebServer,
} from "./playwright.shared";

export default defineConfig({
  ...basePlaywrightConfig,
  testMatch: "**/auth-backend.spec.ts",
  use: {
    ...basePlaywrightConfig.use,
    baseURL: PLAYWRIGHT_FRONTEND_ORIGIN,
  },
  webServer: [
    {
      command: "npm run predev && npx tsx src/index.ts",
      cwd: backendRoot,
      url: `${PLAYWRIGHT_BACKEND_ORIGIN}/health`,
      reuseExistingServer: false,
      env: {
        ...process.env,
        SERVER_PORT: String(PLAYWRIGHT_BACKEND_PORT),
        CORS_ALLOWED_ORIGINS: PLAYWRIGHT_ALLOWED_FRONTEND_ORIGINS,
        CAPTCHA_BYPASS_CODE: PLAYWRIGHT_CAPTCHA_BYPASS_CODE,
      },
    },
    createFrontendWebServer({
      port: PLAYWRIGHT_FRONTEND_PORT,
      reuseExistingServer: false,
      env: {
        ...process.env,
        VITE_API: PLAYWRIGHT_BACKEND_RPC_URL,
      },
    }),
  ],
});