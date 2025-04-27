import { createTRPCContext } from "@trpc/tanstack-react-query";
import { AppRouter } from "@/util/AppRouter";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
