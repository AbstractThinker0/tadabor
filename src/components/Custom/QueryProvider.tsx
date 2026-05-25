import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/components/Custom/queryClient";

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
