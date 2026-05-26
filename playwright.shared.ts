import path from "node:path";
import { fileURLToPath } from "node:url";

import { devices, type PlaywrightTestConfig } from "@playwright/test";

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));

type PlaywrightEnv = Record<string, string | undefined>;

export const backendRoot = path.resolve(workspaceRoot, "../tadabor-backend");

const toPlaywrightEnv = (
  env?: PlaywrightEnv
): Record<string, string> | undefined => {
  if (!env) {
    return undefined;
  }

  const definedEntries = Object.entries(env).filter(
    (entry): entry is [string, string] => entry[1] !== undefined
  );

  return definedEntries.length > 0
    ? Object.fromEntries(definedEntries)
    : undefined;
};

export const basePlaywrightConfig = {
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
} satisfies Omit<PlaywrightTestConfig, "webServer">;

export const createFrontendWebServer = ({
  port,
  env,
  reuseExistingServer = !process.env.CI,
}: {
  port: number;
  env?: PlaywrightEnv;
  reuseExistingServer?: boolean;
}) => ({
  command: `npx vite --host 127.0.0.1 --port ${port} --strictPort`,
  cwd: workspaceRoot,
  url: `http://127.0.0.1:${port}`,
  reuseExistingServer,
  env: toPlaywrightEnv(env),
});
