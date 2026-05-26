import type { MutationFunctionContext } from "@tanstack/query-core";
import { QueryClient } from "@tanstack/react-query";
import { expect, test } from "@playwright/test";

type TadaborRuntime = typeof globalThis & {
  __TADABOR_RPC_URL__?: string;
};

const createStorage = (): Storage => {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key) {
      return values.get(key) ?? null;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
};

const createMutationContext = (): MutationFunctionContext => ({
  client: new QueryClient(),
  meta: undefined,
});

test.describe("logout request", () => {
  test("uses the token snapshot instead of ambient storage", async () => {
    const runtime = globalThis as TadaborRuntime;
    const originalFetch = globalThis.fetch;
    const originalLocalStorage = globalThis.localStorage;
    const originalRpcUrl = runtime.__TADABOR_RPC_URL__;
    const capturedHeaders: string[] = [];

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: createStorage(),
    });
    runtime.__TADABOR_RPC_URL__ = "http://localhost/rpc";

    globalThis.fetch = async (input, init) => {
      const request =
        input instanceof Request ? input : new Request(input, init);

      capturedHeaders.push(request.headers.get("authorization") ?? "");

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    };

    try {
      const { getUserLogoutMutationOptions } = await import(
        "../src/services/backend"
      );
      const mutation = getUserLogoutMutationOptions("snapshotted-token");

      expect(mutation.mutationFn).toBeDefined();

      if (!mutation.mutationFn) {
        throw new Error("Logout mutation function was not created");
      }

      await mutation.mutationFn(undefined, createMutationContext());

      expect(capturedHeaders).toEqual(["Bearer snapshotted-token"]);
    } finally {
      globalThis.fetch = originalFetch;
      runtime.__TADABOR_RPC_URL__ = originalRpcUrl;
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });
});
