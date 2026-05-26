import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getRpcQueryUtils,
} from "@/components/Custom/queryClient";
import { useUserStore } from "@/store/global/userStore";
import type {
  BackendNote,
  TadaborContractInputs,
  TadaborContractOutputs,
} from "tadabor-shared";

type AnalyticsParams = TadaborContractInputs["admin"]["getAnalytics"];
type ListUsersParams = TadaborContractInputs["admin"]["listUsers"];

type FetchNoteResponse = TadaborContractOutputs["notes"]["fetchNote"];
type ConnectedDevicesResponse =
  TadaborContractOutputs["user"]["getConnectedDevices"];

const orpc = getRpcQueryUtils();

export const getUserLogoutMutationOptions = (authToken?: string) =>
  authToken
    ? orpc.auth.logout.mutationOptions({ context: { authToken } })
    : orpc.auth.logout.mutationOptions();

export const useUserRefresh = () => {
  const {
    isLogged,
    isLoggedOffline,
    token: userToken,
  } = useUserStore((state) => state);

  return useQuery(
    orpc.auth.refresh.queryOptions({
      enabled: (!isLogged || isLoggedOffline) && userToken.length > 0, // Only fetch if needed
      retry: false,
      refetchInterval: isLoggedOffline ? 60000 : false, // Retry every 60 seconds when offline
    })
  );
};

export const useUserLogin = () => {
  return useMutation(orpc.auth.login.mutationOptions());
};

export const useUserSignup = () => {
  return useMutation(orpc.auth.signUp.mutationOptions());
};

export const useUserLogout = () => {
  const authToken = useUserStore((state) => state.token);

  return useMutation(getUserLogoutMutationOptions(authToken));
};

export const useUserUpdateProfile = () => {
  return useMutation(orpc.auth.updateEmailOrUsername.mutationOptions());
};

export const useUserUpdateBio = () => {
  return useMutation(orpc.user.updateProfileMeta.mutationOptions());
};

export const usePasswordRequestReset = () => {
  return useMutation(orpc.password.requestPasswordReset.mutationOptions());
};

export const usePasswordReset = () => {
  return useMutation(orpc.password.resetPassword.mutationOptions());
};

export const usePasswordUpdate = () => {
  return useMutation(orpc.password.updatePassword.mutationOptions());
};

export const useFetchAnalytics = () => {
  return (params: AnalyticsParams) => orpc.admin.getAnalytics.call(params);
};

export const useQueryAnalytics = (
  params: AnalyticsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery(
    orpc.admin.getAnalytics.queryOptions({
      input: params,
      enabled: options?.enabled ?? false,
    })
  );
};

export const useQueryActionStats = (options?: { enabled?: boolean }) => {
  return useQuery(
    orpc.admin.getActionStats.queryOptions({
      enabled: options?.enabled ?? false,
    })
  );
};

export const useQueryUserStats = (options?: { enabled?: boolean }) => {
  return useQuery(
    orpc.admin.getUserStats.queryOptions({
      enabled: options?.enabled ?? false,
    })
  );
};

export const useFetchUsers = (params: ListUsersParams) => {
  return useQuery(
    orpc.admin.listUsers.queryOptions({
      input: params,
      placeholderData: {
        data: [],
        meta: { total: 0, limit: 100, offset: 0 },
      },
    })
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.admin.updateUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.admin.listUsers.key(),
        });
      },
    })
  );
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.admin.deleteUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.admin.listUsers.key(),
        });
      },
    })
  );
};

export const useFetchNote = () => {
  const queryClient = useQueryClient();

  return (noteID: string) =>
    queryClient.fetchQuery(
      orpc.notes.fetchNote.queryOptions({
        input: { id: noteID },
      })
    );
};

export const useSyncNotes = () => {
  return useMutation(orpc.notes.syncNotes.mutationOptions());
};

export const useUploadNote = () => {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.notes.uploadNote.mutationOptions({
      onSuccess(data, variables) {
        const noteId = `${variables.type}:${variables.key}`;
        const queryKey = orpc.notes.fetchNote.queryKey({
          input: { id: noteId },
        });

        // Check if the note is already cached; skip update if not
        const oldData = queryClient.getQueryData<FetchNoteResponse>(queryKey);
        if (!oldData) return;

        // Update the cache by merging
        const note: BackendNote = {
          ...oldData.note,
          ...variables,
          ...data.note,
          content: variables.content ?? null,
          direction: variables.direction ?? null,
        };

        queryClient.setQueryData<FetchNoteResponse>(queryKey, {
          success: true,
          note,
        });
      },
    })
  );
};

export const useConnectedDevices = () => {
  return useQuery(orpc.user.getConnectedDevices.queryOptions());
};

export const useRevokeDevice = () => {
  const queryClient = useQueryClient();

  return useMutation(
    orpc.user.revokeDevice.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.setQueryData<ConnectedDevicesResponse>(
          orpc.user.getConnectedDevices.queryKey(),
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              devices: oldData.devices.filter(
                (device) => device.id !== variables.tokenId
              ),
            };
          }
        );
      },
    })
  );
};
