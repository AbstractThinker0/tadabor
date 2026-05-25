import { keyToken } from "@/store/global/userStore";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import {
  createTanstackQueryUtils,
  type RouterUtils,
} from "@orpc/tanstack-query";
import { QueryClient } from "@tanstack/react-query";
import type { TadaborContractClient } from "tadabor-shared";

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

let browserRpcClient: TadaborContractClient | undefined;

export function getRpcClient() {
  if (!browserRpcClient) {
    browserRpcClient = createORPCClient(
      new RPCLink({
        url: import.meta.env.VITE_API || "",
        headers() {
          const headers: Record<string, string> = {};
          const token = localStorage.getItem(keyToken);
          if (token) headers.Authorization = `Bearer ${token}`;
          headers["X-App-Version"] = APP_VERSION;
          return headers;
        },
      })
    ) as TadaborContractClient;
  }

  return browserRpcClient;
}

type TadaborTanstackQueryUtils = RouterUtils<TadaborContractClient>;

let browserRpcQueryUtils: TadaborTanstackQueryUtils | undefined;

export function getRpcQueryUtils() {
  if (!browserRpcQueryUtils) {
    browserRpcQueryUtils = createTanstackQueryUtils(getRpcClient());
  }

  return browserRpcQueryUtils;
}
