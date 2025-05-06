import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useEffect, useRef, useState } from "react";
import { TRPCProvider } from "@/util/trpc";
import { AppRouter } from "@/util/AppRouter";
import { useAppSelector } from "@/store";

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

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const token = useAppSelector((state) => state.user.token);

  const tokenRef = useRef(token);

  // Update ref when token changes
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API || "",
          headers() {
            const headers: Record<string, string> = {};

            if (tokenRef.current) {
              headers.Authorization = `Bearer ${tokenRef.current}`;
            }

            headers["X-App-Version"] = APP_VERSION; // Custom header for client version
            return headers;
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
