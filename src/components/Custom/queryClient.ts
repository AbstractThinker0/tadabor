import { keyToken } from "@/store/global/userStore";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";
import {
  createTanstackQueryUtils,
  type RouterUtils,
} from "@orpc/tanstack-query";
import { QueryClient } from "@tanstack/react-query";
import type { TadaborContract } from "tadabor-shared";

const rpcUrl =
  import.meta.env?.VITE_API ??
  (globalThis as { __TADABOR_RPC_URL__?: string }).__TADABOR_RPC_URL__ ??
  "";
const appVersion = typeof APP_VERSION === "undefined" ? "dev" : APP_VERSION;

type RpcClientContext = {
  authToken?: string;
};

export type TadaborContextClient = ContractRouterClient<
  TadaborContract,
  RpcClientContext
>;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // For now we only save Offline First Data so we don't refetching
        staleTime: 60000,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;
export function getQueryClient() {
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render.
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

let browserRpcClient: TadaborContextClient | undefined;

export function getRpcClient() {
  if (!browserRpcClient) {
    browserRpcClient = createORPCClient<TadaborContextClient>(
      new RPCLink<RpcClientContext>({
        url: rpcUrl,
        headers(options) {
          const headers: Record<string, string> = {
            "X-App-Version": appVersion,
          };
          const token = options.context.authToken ?? localStorage.getItem(keyToken);

          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }

          return headers;
        },
      })
    );
  }

  return browserRpcClient;
}

type TadaborTanstackQueryUtils = RouterUtils<TadaborContextClient>;

let browserRpcQueryUtils: TadaborTanstackQueryUtils | undefined;

export function getRpcQueryUtils() {
  if (!browserRpcQueryUtils) {
    browserRpcQueryUtils = createTanstackQueryUtils(getRpcClient());
  }

  return browserRpcQueryUtils;
}
