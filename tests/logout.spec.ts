import { expect, test } from "@playwright/test";

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

test.describe("logout request", () => {
  test("uses the token snapshot instead of ambient storage", async () => {
    const originalFetch = globalThis.fetch;
    const originalLocalStorage = globalThis.localStorage;
    const originalRpcUrl = (
      globalThis as typeof globalThis & { __TADABOR_RPC_URL__?: string }
    ).__TADABOR_RPC_URL__;
    const capturedHeaders: string[] = [];

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: createStorage(),
    });
    (
      globalThis as typeof globalThis & { __TADABOR_RPC_URL__?: string }
    ).__TADABOR_RPC_URL__ = "http://localhost/rpc";

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
      await getUserLogoutMutationOptions("snapshotted-token").mutationFn(
        undefined
      );

      expect(capturedHeaders).toEqual(["Bearer snapshotted-token"]);
    } finally {
      globalThis.fetch = originalFetch;
      (
        globalThis as typeof globalThis & { __TADABOR_RPC_URL__?: string }
      ).__TADABOR_RPC_URL__ = originalRpcUrl;
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });
});
