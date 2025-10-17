import { useTRPC, useTRPCClient } from "@/util/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toasterBottomCenter } from "@/components/ui/toaster";

export const useAdmin = () => {
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  // Queries
  const analyticsQuery = useQuery({
    ...trpc.admin.getAnalytics.queryOptions({ limit: 50, offset: 0 }),
    enabled: false,
  });

  const actionStatsQuery = useQuery({
    ...trpc.admin.getActionStats.queryOptions(),
    enabled: false,
  });

  const userStatsQuery = useQuery({
    ...trpc.admin.getUserStats.queryOptions(),
    enabled: false,
  });

  const usersQuery = useQuery({
    ...trpc.admin.listUsers.queryOptions({ limit: 50, offset: 0 }),
    enabled: false,
  });

  // Mutations
  const updateUserMutation = useMutation(
    trpc.admin.updateUser.mutationOptions()
  );
  const deleteUserMutation = useMutation(
    trpc.admin.deleteUser.mutationOptions()
  );

  // Helpers
  const fetchAnalytics = async (params?: {
    userId?: number;
    action?: string;
    limit?: number;
    offset?: number;
    startDate?: number;
    endDate?: number;
  }) => {
    try {
      // Always go through React Query cache so observers (analyticsQuery) receive updates
      const { queryKey, queryFn } = trpc.admin.getAnalytics.queryOptions(
        params ?? { limit: 50, offset: 0 }
      );
      const data = await queryClient.fetchQuery({ queryKey, queryFn });
      return data;
    } catch (e) {
      toasterBottomCenter.create({
        type: "error",
        description: "Failed to fetch analytics",
      });
    }
  };

  const fetchActionStats = async () => {
    try {
      return await actionStatsQuery.refetch();
    } catch (e) {
      toasterBottomCenter.create({
        type: "error",
        description: "Failed to fetch action stats",
      });
    }
  };

  const fetchUserStats = async () => {
    try {
      return await userStatsQuery.refetch();
    } catch (e) {
      toasterBottomCenter.create({
        type: "error",
        description: "Failed to fetch user stats",
      });
    }
  };

  const fetchUsers = async (params?: { limit?: number; offset?: number }) => {
    try {
      if (params) {
        return await trpcClient.admin.listUsers.query(params);
      }
      return await usersQuery.refetch();
    } catch (e) {
      toasterBottomCenter.create({
        type: "error",
        description: "Failed to fetch users",
      });
    }
  };

  const updateUser = async (payload: {
    id: number;
    username?: string;
    email?: string;
    role?: number;
  }) => {
    try {
      const res = await updateUserMutation.mutateAsync(payload);
      toasterBottomCenter.create({
        type: "success",
        description: "User updated",
      });
      return res;
    } catch (e) {
      toasterBottomCenter.create({
        type: "error",
        description: "Failed to update user",
      });
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const res = await deleteUserMutation.mutateAsync({ id });
      if (res?.success) {
        toasterBottomCenter.create({
          type: "success",
          description: "User deleted",
        });
      } else {
        toasterBottomCenter.create({
          type: "error",
          description: res?.message || "Failed to delete user",
        });
      }
      return res;
    } catch (e) {
      toasterBottomCenter.create({
        type: "error",
        description: "Failed to delete user",
      });
    }
  };

  return {
    analyticsQuery,
    actionStatsQuery,
    userStatsQuery,
    usersQuery,
    fetchAnalytics,
    fetchActionStats,
    fetchUserStats,
    fetchUsers,
    updateUser,
    deleteUser,
  };
};
