import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/util/AppRouter";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
