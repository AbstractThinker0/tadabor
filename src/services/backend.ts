import { useTRPC, useTRPCClient } from "@/util/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/store";

export const useUserRefresh = () => {
  const trpc = useTRPC();
  const {
    isLogged,
    isLoggedOffline,
    token: userToken,
  } = useAppSelector((state) => state.user);

  return useQuery({
    ...trpc.auth.refresh.queryOptions(),
    enabled: (!isLogged || isLoggedOffline) && userToken.length > 0, // Only fetch if needed
    retry: false,
    refetchInterval: isLoggedOffline ? 60000 : false, // Retry every 60 seconds when offline
  });
};

export const useUserLogin = () => {
  const trpc = useTRPC();
  return useMutation(trpc.auth.login.mutationOptions());
};

export const useUserSignup = () => {
  const trpc = useTRPC();
  return useMutation(trpc.auth.signUp.mutationOptions());
};

export const useUserUpdateProfile = () => {
  const trpc = useTRPC();
  return useMutation(trpc.auth.updateEmailOrUsername.mutationOptions());
};

export const usePasswordRequestReset = () => {
  const trpc = useTRPC();
  return useMutation(trpc.password.requestPasswordReset.mutationOptions());
};

export const usePasswordReset = () => {
  const trpc = useTRPC();
  return useMutation(trpc.password.resetPassword.mutationOptions());
};

export const usePasswordUpdate = () => {
  const trpc = useTRPC();
  return useMutation(trpc.password.updatePassword.mutationOptions());
};

export const useFetchAnalytics = () => {
  const trpcClient = useTRPCClient();
  return (params: {
    userId?: number;
    action?: string;
    limit?: number;
    offset?: number;
  }) => {
    return trpcClient.admin.getAnalytics.query({
      userId: params.userId,
      action: params.action,
      limit: params.limit,
      offset: params.offset,
    });
  };
};

export const useQueryAnalytics = (params: {
  limit?: number;
  offset?: number;
}) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.getAnalytics.queryOptions(
      { limit: params.limit, offset: params.offset },
      { enabled: false }
    )
  );
};

export const useQueryActionStats = () => {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.getActionStats.queryOptions(undefined, { enabled: false })
  );
};

export const useQueryUserStats = () => {
  const trpc = useTRPC();
  return useQuery(
    trpc.admin.getUserStats.queryOptions(undefined, { enabled: false })
  );
};

export const useFetchUsers = (params: { limit?: number; offset?: number }) => {
  const trpc = useTRPC();

  return useQuery(
    trpc.admin.listUsers.queryOptions(
      {
        limit: params.limit,
        offset: params.offset,
      },
      {
        placeholderData: {
          data: [],
          meta: { total: 0, limit: 100, offset: 0 },
        },
      }
    )
  );
};

export const useUpdateUser = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const listUsersQueryOptions = trpc.admin.listUsers.queryOptions({});

  return useMutation(
    trpc.admin.updateUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: listUsersQueryOptions.queryKey,
        });
      },
    })
  );
};

export const useDeleteUser = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const listUsersQueryOptions = trpc.admin.listUsers.queryOptions({});
  return useMutation(
    trpc.admin.deleteUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: listUsersQueryOptions.queryKey,
        });
      },
    })
  );
};

export const useFetchNote = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return (noteID: string) => {
    return queryClient.fetchQuery(
      trpc.notes.fetchNote.queryOptions({ id: noteID })
    );
  };
};

export const useSyncNotes = () => {
  const trpc = useTRPC();
  return useMutation(trpc.notes.syncNotes.mutationOptions());
};

export const useUploadNote = () => {
  const trpc = useTRPC();
  return useMutation(trpc.notes.uploadNote.mutationOptions());
};
