import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

import { TRPCProvider } from "@/util/trpc";
import type { AppRouter } from "@/util/AppRouter";
import { keyToken } from "@/store/slices/global/user";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // For now we only save Offline First Data so we don't refetching
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

let browserTrpcClient:
  | ReturnType<typeof createTRPCClient<AppRouter>>
  | undefined;
export function getTrpcClient() {
  if (!browserTrpcClient) {
    browserTrpcClient = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API || "",
          headers() {
            const headers: Record<string, string> = {};
            const token = localStorage.getItem(keyToken);
            if (token) headers.Authorization = `Bearer ${token}`;
            headers["X-App-Version"] = APP_VERSION;
            return headers;
          },
        }),
      ],
    });
  }
  return browserTrpcClient;
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  const trpcClient = getTrpcClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
