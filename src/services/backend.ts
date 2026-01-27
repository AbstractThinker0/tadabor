import { useTRPC, useTRPCClient } from "@/util/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/global/userStore";

export const useUserRefresh = () => {
  const trpc = useTRPC();
  const {
    isLogged,
    isLoggedOffline,
    token: userToken,
  } = useUserStore((state) => state);

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

export const useUserUpdateBio = () => {
  const trpc = useTRPC();
  return useMutation(trpc.user.updateProfileMeta.mutationOptions());
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
  const queryClient = useQueryClient();

  return useMutation(
    trpc.notes.uploadNote.mutationOptions({
      onSuccess(data, variables) {
        const noteId = `${variables.type}:${variables.key}`;

        const queryKey = trpc.notes.fetchNote.queryOptions({
          id: noteId,
        }).queryKey;

        // Check if the note is already cached; skip update if not
        const oldData = queryClient.getQueryData(queryKey);
        if (!oldData) return;

        // Update the cache by merging
        queryClient.setQueryData(queryKey, {
          success: true,
          note: {
            ...oldData.note,
            ...variables,
            ...data.note,
          },
        });
      },
    })
  );
};

export const useConnectedDevices = () => {
  const trpc = useTRPC();
  return useQuery(trpc.user.getConnectedDevices.queryOptions());
};

export const useRevokeDevice = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const devicesQueryOptions = trpc.user.getConnectedDevices.queryOptions();

  return useMutation(
    trpc.user.revokeDevice.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.setQueryData(devicesQueryOptions.queryKey, (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            devices: oldData.devices.filter(
              (device) => device.id !== variables.tokenId
            ),
          };
        });
      },
    })
  );
};
