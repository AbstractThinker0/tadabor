import { randomUUID } from "node:crypto";

import { getOptionalEnv } from "./playwrightEnv";

export interface OfflineUserSessionFixture {
  userId: number;
  authToken: string;
  email: string;
  username: string;
}

const createFixtureSuffix = () => randomUUID().replace(/-/g, "").slice(0, 12);

export const createBackendSeedPassword = () => {
  const configuredPassword = getOptionalEnv("PLAYWRIGHT_TEST_USER_PASSWORD");

  if (configuredPassword) {
    return configuredPassword;
  }

  return `Pw-${createFixtureSuffix()}!aA1`;
};

export const createOfflineUserSessionFixture = (
  userId = Number(getOptionalEnv("PLAYWRIGHT_OFFLINE_TEST_USER_ID") ?? "7")
): OfflineUserSessionFixture => {
  const suffix = createFixtureSuffix();

  return {
    userId,
    authToken:
      getOptionalEnv("PLAYWRIGHT_OFFLINE_TEST_AUTH_TOKEN") ??
      `playwright-offline-${suffix}`,
    email:
      getOptionalEnv("PLAYWRIGHT_OFFLINE_TEST_EMAIL") ??
      `playwright.offline.${suffix}@example.com`,
    username:
      getOptionalEnv("PLAYWRIGHT_OFFLINE_TEST_USERNAME") ??
      `playwrightOffline${suffix}`,
  };
};
