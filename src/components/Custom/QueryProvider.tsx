import { QueryClientProvider } from "@tanstack/react-query";

import { TRPCProvider } from "@/util/trpc";
import { getQueryClient, getTrpcClient } from "@/components/Custom/queryClient";

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const queryClient = getQueryClient();

  const trpcClient = getTrpcClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
};
