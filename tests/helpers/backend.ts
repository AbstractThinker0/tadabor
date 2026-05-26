import { randomUUID } from "node:crypto";

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";
import type { TadaborContract } from "tadabor-shared";

import {
  PLAYWRIGHT_BACKEND_RPC_URL,
  PLAYWRIGHT_CAPTCHA_BYPASS_CODE,
} from "./backendConfig";

type BackendClientContext = {
  authToken?: string;
};

type BackendTestClient = ContractRouterClient<
  TadaborContract,
  BackendClientContext
>;

export interface BackendSeedCredentials {
  email: string;
  username: string;
  password: string;
}

export const createBackendTestClient = (authToken = ""): BackendTestClient =>
  createORPCClient(
    new RPCLink<BackendClientContext>({
      url: PLAYWRIGHT_BACKEND_RPC_URL,
      headers: ({ context }) => {
        const token = context.authToken || authToken;

        return {
          "x-app-version": "playwright-integration",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
      },
    })
  );

export const createBackendSeedCredentials = (): BackendSeedCredentials => {
  const suffix = randomUUID().replace(/-/g, "").slice(0, 16);

  return {
    email: `playwright.${suffix}@example.com`,
    username: `playwright${suffix}`,
    password: "Password123!",
  };
};

export const seedBackendUser = async (): Promise<BackendSeedCredentials> => {
  const credentials = createBackendSeedCredentials();

  await createBackendTestClient().auth.signUp({
    ...credentials,
    captchaToken: PLAYWRIGHT_CAPTCHA_BYPASS_CODE,
  });

  return credentials;
};

export const isBackendSessionActive = async (
  authToken: string
): Promise<boolean> => {
  if (!authToken) {
    return false;
  }

  try {
    await createBackendTestClient(authToken).auth.refresh();
    return true;
  } catch {
    return false;
  }
};
