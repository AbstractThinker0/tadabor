import {
  Button,
  Flex,
  Input,
  Table,
  Text,
  NativeSelect,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/util/trpc";
import { toasterBottomCenter } from "@/components/ui/toaster";
import { Paginator } from "@/components/Generic/Paginator";
import type { UserData } from "@/types/admin";

const ROLE_LABELS: Record<number, string> = {
  0: "User",
  1: "Moderator",
  2: "Admin",
};

const getRoleLabel = (role: number | null | undefined): string => {
  return ROLE_LABELS[role ?? 0] ?? "User";
};

export const UsersTab = () => {
  const { t } = useTranslation();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Mutations
  const updateUserMutation = useMutation(
    trpc.admin.updateUser.mutationOptions()
  );
  const deleteUserMutation = useMutation(
    trpc.admin.deleteUser.mutationOptions()
  );

  const [editing, setEditing] = useState<
    Record<number, { username: string; email: string; role: string }>
  >({});

  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  const listUsersQueryOptions = trpc.admin.listUsers.queryOptions({
    limit,
    offset,
  });

  const {
    data: usersPage,
    isFetching,
    refetch,
  } = useQuery(listUsersQueryOptions);

  const startEdit = (u: UserData) => {
    setEditing((s) => ({
      ...s,
      [u.id]: {
        username: u.username,
        email: u.email,
        role: String(u.role ?? "0"),
      },
    }));
  };

  const cancelEdit = (id: number) => {
    setEditing((s) => {
      const n = { ...s };
      delete n[id];
      return n;
    });
  };

  const saveEdit = async (id: number) => {
    const e = editing[id];
    if (!e) return;
    try {
      await updateUserMutation.mutateAsync({
        id,
        username: e.username,
        email: e.email,
        role: Number(e.role),
      });
      toasterBottomCenter.create({
        type: "success",
        description: "User updated",
      });
      await queryClient.invalidateQueries({
        queryKey: listUsersQueryOptions.queryKey,
      });
      cancelEdit(id);
    } catch (err) {
      console.error("Failed to update user:", err);
      toasterBottomCenter.create({
        type: "error",
        description: "Failed to update user",
      });
    }
  };

  const handleDelete = async (id: number) => {
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
      await queryClient.invalidateQueries({
        queryKey: listUsersQueryOptions.queryKey,
      });
    } catch (err) {
      console.error("Failed to delete user:", err);
      toasterBottomCenter.create({
        type: "error",
        description: "Failed to delete user",
      });
    }
  };

  return (
    <Flex direction="column" gap={2}>
      <Flex>
        <Button size="sm" onClick={() => refetch()}>
          {t("ui.actions.refresh")}
        </Button>
      </Flex>
      {isFetching && (
        <Text fontSize="sm" color="fg.muted">
          {t("ui.state.loading")}
        </Text>
      )}
      {usersPage?.data?.length ? (
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Username</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Role</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {usersPage.data.map((u: UserData) => {
              const e = editing[u.id];
              return (
                <Table.Row key={u.id}>
                  <Table.Cell>{u.id}</Table.Cell>
                  <Table.Cell>
                    {e ? (
                      <Input
                        size="xs"
                        value={e.username}
                        onChange={(ev) =>
                          setEditing((s) => ({
                            ...s,
                            [u.id]: { ...e, username: ev.target.value },
                          }))
                        }
                      />
                    ) : (
                      u.username
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {e ? (
                      <Input
                        size="xs"
                        value={e.email}
                        onChange={(ev) =>
                          setEditing((s) => ({
                            ...s,
                            [u.id]: { ...e, email: ev.target.value },
                          }))
                        }
                      />
                    ) : (
                      u.email
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {e ? (
                      <NativeSelect.Root size="xs" bgColor={"bg"}>
                        <NativeSelect.Field
                          value={e.role}
                          onChange={(ev) =>
                            setEditing((s) => ({
                              ...s,
                              [u.id]: { ...e, role: ev.target.value },
                            }))
                          }
                        >
                          <option value="0">{ROLE_LABELS[0]}</option>
                          <option value="1">{ROLE_LABELS[1]}</option>
                          <option value="2">{ROLE_LABELS[2]}</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    ) : (
                      getRoleLabel(u.role)
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {e ? (
                      <Flex gap={2} justify="flex-end">
                        <Button size="xs" onClick={() => saveEdit(u.id)}>
                          {t("ui.actions.save")}
                        </Button>
                        <Button
                          size="xs"
                          variant="subtle"
                          onClick={() => cancelEdit(u.id)}
                        >
                          {t("ui.actions.cancel")}
                        </Button>
                      </Flex>
                    ) : (
                      <Flex gap={2} justify="flex-end">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => startEdit(u)}
                        >
                          {t("ui.actions.edit")}
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorPalette="red"
                          onClick={() => handleDelete(u.id)}
                        >
                          {t("ui.actions.delete")}
                        </Button>
                      </Flex>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      ) : (
        <Text fontSize="sm" color="fg.muted">
          {t("ui.state.no_data")}
        </Text>
      )}

      {usersPage?.meta ? (
        <Paginator
          total={usersPage.meta.total}
          limit={limit}
          offset={offset}
          onChange={({ limit: nl, offset: no }) => {
            setLimit(nl);
            setOffset(no);
          }}
        />
      ) : null}
    </Flex>
  );
};
