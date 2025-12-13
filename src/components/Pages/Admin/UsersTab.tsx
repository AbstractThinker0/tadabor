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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/util/trpc";
import { useAdmin } from "@/hooks/useAdmin";
import { Paginator } from "@/components/Generic/Paginator";
import type { UserData } from "@/types/admin";

export const UsersTab = ({ initialUsers }: { initialUsers: UserData[] }) => {
  const { t } = useTranslation();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { updateUser, deleteUser } = useAdmin();

  const [editing, setEditing] = useState<
    Record<number, { username: string; email: string; role: string }>
  >({});

  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  const {
    data: usersPage,
    isFetching,
    refetch,
  } = useQuery({
    ...trpc.admin.listUsers.queryOptions({ limit, offset }),
    initialData:
      initialUsers?.length > 0
        ? {
            data: initialUsers,
            meta: { total: initialUsers.length, limit: 100, offset: 0 },
          }
        : undefined,
  });

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
    await updateUser({
      id,
      username: e.username,
      email: e.email,
      role: Number(e.role),
    });
    await queryClient.invalidateQueries({
      queryKey: trpc.admin.listUsers.queryKey({ limit, offset }),
    });
    cancelEdit(id);
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
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    ) : (
                      String(u.role ?? "0")
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
                          onClick={async () => {
                            await deleteUser(u.id);
                            await queryClient.invalidateQueries({
                              queryKey: trpc.admin.listUsers.queryKey({
                                limit,
                                offset,
                              }),
                            });
                          }}
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
