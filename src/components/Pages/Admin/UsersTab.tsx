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

import { toasterBottomCenter } from "@/components/ui/toaster";
import { Paginator } from "@/components/Generic/Paginator";
import type { UserData } from "@/types/admin";
import {
  useDeleteUser,
  useFetchUsers,
  useUpdateUser,
} from "@/services/backend";
import { tryCatch } from "@/util/trycatch";

export const UsersTab = () => {
  const { t } = useTranslation();

  const roleLabels: Record<number, string> = {
    0: t("admin.role_user"),
    1: t("admin.role_moderator"),
    2: t("admin.role_admin"),
  };

  const getRoleLabel = (role: number | null | undefined): string => {
    return roleLabels[role ?? 0] ?? roleLabels[0];
  };

  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  // Mutations
  const updateUserMutation = useUpdateUser();

  const deleteUserMutation = useDeleteUser();

  const [editing, setEditing] = useState<
    Record<number, { username: string; email: string; role: string }>
  >({});

  const {
    data: usersPage,
    isFetching,
    refetch,
  } = useFetchUsers({ limit, offset });

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
    const { error } = await tryCatch(
      updateUserMutation.mutateAsync({
        id,
        username: e.username,
        email: e.email,
        role: Number(e.role),
      })
    );
    if (error) {
      console.error("Failed to update user:", error);
      toasterBottomCenter.error(t("admin.messages.update_failed"));
    } else {
      toasterBottomCenter.success(t("admin.messages.update_success"));
      cancelEdit(id);
    }
  };

  const handleDelete = async (id: number) => {
    const { result: res, error } = await tryCatch(
      deleteUserMutation.mutateAsync({ id })
    );
    if (error) {
      console.error("Failed to delete user:", error);
      toasterBottomCenter.error(t("admin.messages.delete_failed"));
    } else if (res.success) {
      toasterBottomCenter.success(t("admin.messages.delete_success"));
    } else {
      toasterBottomCenter.error(
        res.message || t("admin.messages.delete_failed")
      );
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
              <Table.ColumnHeader>{t("admin.id")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("admin.username")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("admin.email")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("admin.role")}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">
                {t("admin.actions")}
              </Table.ColumnHeader>
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
                          <option value="0">{roleLabels[0]}</option>
                          <option value="1">{roleLabels[1]}</option>
                          <option value="2">{roleLabels[2]}</option>
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
