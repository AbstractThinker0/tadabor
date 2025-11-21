import { usePageNav } from "@/hooks/usePageNav";
import { useAdmin } from "@/hooks/useAdmin";
import {
  Box,
  Button,
  Flex,
  Input,
  Table,
  Tabs,
  Text,
  NativeSelect,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Paginator } from "@/components/Generic/Paginator";
import type {
  AnalyticsResponse,
  UsersResponse,
  UserData,
} from "@/types/admin";

const AnalyticsTab = ({ users }: { users: UserData[] }) => {
  const { t } = useTranslation();
  const { analyticsQuery, fetchAnalytics } = useAdmin();
  const [action, setAction] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState<AnalyticsResponse | null>(null);

  const load = async (params?: { limit?: number; offset?: number }) => {
    const l = params?.limit ?? limit;
    const o = params?.offset ?? offset;
    setLoading(true);
    const res = await fetchAnalytics({
      userId: userId ? Number(userId) : undefined,
      action: action || undefined,
      limit: l,
      offset: o,
    });
    setLoading(false);
    if (res) {
      setPageData(res);
      setLimit(res.meta?.limit ?? l);
      setOffset(res.meta?.offset ?? o);
    }
  };

  return (
    <Flex direction="column" gap={2}>
      <Flex gap={2} wrap="wrap" align="center" bg="bg.subtle" p={2} rounded="md">
        <NativeSelect.Root size="sm" width="200px">
          <NativeSelect.Field
            placeholder={t("admin.userId")}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">{t("ui.actions.all")}</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username || u.email || u.id}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <Input
          size="sm"
          placeholder={t("admin.action")}
          value={action}
          onChange={(e) => setAction(e.target.value)}
          w="200px"
        />
        <Button
          size="sm"
          onClick={() => {
            setOffset(0);
            load({ limit, offset: 0 });
          }}
        >
          {t("ui.actions.load")}
        </Button>
      </Flex>

      {(loading || analyticsQuery.isFetching) && (
        <Text fontSize="sm" color="fg.muted">{t("ui.state.loading")}</Text>
      )}

      {pageData?.data?.length ? (
        <Flex direction="column" gap={2}>
          <Paginator
            total={pageData.meta?.total ?? 0}
            limit={limit}
            offset={offset}
            onChange={({ limit: nl, offset: no }) => {
              setLimit(nl);
              setOffset(no);
              load({ limit: nl, offset: no });
            }}
          />
          {pageData.data.map((row) => (
            <Box key={row.id} p={2} bg="bg.panel" rounded="md" borderWidth="1px" fontSize="sm">
              <Flex gap={3} wrap="wrap" align="center">
                <Text fontWeight="bold" minW="40px">#{row.id}</Text>
                <Text fontWeight="medium" minW="100px">{row.action}</Text>
                <Text color="fg.muted">user: {row.username ?? row.userId}</Text>
                <Text color="fg.muted" ml="auto">
                  {new Date(row.timestamp).toLocaleString()}
                </Text>
              </Flex>
              {(row.oldData || row.newData) && (
                <Box mt={1}>
                  <details>
                    <summary style={{ cursor: "pointer", color: "fg.muted" }}>
                      Details
                    </summary>
                    <Flex gap={2} mt={1}>
                      {row.oldData && (
                        <Box flex={1} p={1} bg="bg.subtle" rounded="sm" fontSize="xs">
                          <Text fontWeight="bold">Old</Text>
                          <Box as="pre" overflow="auto" maxH="100px">{row.oldData}</Box>
                        </Box>
                      )}
                      {row.newData && (
                        <Box flex={1} p={1} bg="bg.subtle" rounded="sm" fontSize="xs">
                          <Text fontWeight="bold">New</Text>
                          <Box as="pre" overflow="auto" maxH="100px">{row.newData}</Box>
                        </Box>
                      )}
                    </Flex>
                  </details>
                </Box>
              )}
            </Box>
          ))}
          <Paginator
            total={pageData.meta?.total ?? 0}
            limit={limit}
            offset={offset}
            onChange={({ limit: nl, offset: no }) => {
              setLimit(nl);
              setOffset(no);
              load({ limit: nl, offset: no });
            }}
          />
        </Flex>
      ) : (
        <Text fontSize="sm" color="fg.muted">{t("ui.state.no_data")}</Text>
      )}
    </Flex>
  );
};

const ActionsTab = () => {
  const { t } = useTranslation();
  const { actionStatsQuery, fetchActionStats } = useAdmin();
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  const data = actionStatsQuery.data ?? [];
  const total = data.length;
  const pageSlice = useMemo(
    () => data.slice(offset, Math.min(offset + limit, total)),
    [data, offset, limit, total]
  );

  return (
    <Flex direction="column" gap={2}>
      <Button
        size="sm"
        alignSelf="flex-start"
        onClick={async () => {
          await fetchActionStats();
          setOffset(0);
        }}
      >
        {t("ui.actions.load")}
      </Button>
      {data?.length ? (
        <Flex direction="column" gap={2}>
          <Paginator
            total={total}
            limit={limit}
            offset={offset}
            onChange={({ limit: nl, offset: no }) => {
              setLimit(nl);
              setOffset(no);
            }}
          />
          <Flex direction="column" gap={1}>
            {pageSlice.map((row) => (
              <Flex key={row.action} gap={2} align="center" fontSize="sm">
                <Box w="180px" fontWeight="medium">{row.action}</Box>
                <Box flex={1} bg="bg.subtle" h="4" rounded="sm" overflow="hidden">
                  <Box h="100%" w={`${Number(row.count)}%`} bg="fg.emphasized" />
                </Box>
                <Box w="50px" textAlign="right" fontWeight="bold">
                  {String(row.count)}
                </Box>
              </Flex>
            ))}
          </Flex>
          <Paginator
            total={total}
            limit={limit}
            offset={offset}
            onChange={({ limit: nl, offset: no }) => {
              setLimit(nl);
              setOffset(no);
            }}
          />
        </Flex>
      ) : (
        <Text fontSize="sm" color="fg.muted">{t("ui.state.no_data")}</Text>
      )}
    </Flex>
  );
};

const UserStatsTab = () => {
  const { t } = useTranslation();
  const { userStatsQuery, fetchUserStats } = useAdmin();
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  const max = useMemo(() => {
    if (!userStatsQuery.data?.length) return 0;
    return userStatsQuery.data.reduce(
      (m: number, r) => Math.max(m, Number(r.count) || 0),
      0
    );
  }, [userStatsQuery.data]);

  const data = userStatsQuery.data ?? [];
  const total = data.length;
  const pageSlice = useMemo(
    () => data.slice(offset, Math.min(offset + limit, total)),
    [data, offset, limit, total]
  );

  return (
    <Flex direction="column" gap={2}>
      <Button
        size="sm"
        alignSelf="flex-start"
        onClick={async () => {
          await fetchUserStats();
          setOffset(0);
        }}
      >
        {t("ui.actions.load")}
      </Button>
      {data?.length ? (
        <Flex direction="column" gap={2}>
          <Paginator
            total={total}
            limit={limit}
            offset={offset}
            onChange={({ limit: nl, offset: no }) => {
              setLimit(nl);
              setOffset(no);
            }}
          />
          <Flex direction="column" gap={1}>
            {pageSlice.map((row) => (
              <Flex key={row.userId} gap={2} align="center" fontSize="sm">
                <Box w="200px" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">{row.username ?? row.userId}</Box>
                <Box flex={1} bg="bg.subtle" h="4" rounded="sm" overflow="hidden">
                  <Box
                    h="100%"
                    w={
                      max
                        ? `${Math.round((Number(row.count) / max) * 100)}%`
                        : "0%"
                    }
                    bg="fg.emphasized"
                  />
                </Box>
                <Box w="50px" textAlign="right" fontWeight="bold">
                  {String(row.count)}
                </Box>
              </Flex>
            ))}
          </Flex>
          <Paginator
            total={total}
            limit={limit}
            offset={offset}
            onChange={({ limit: nl, offset: no }) => {
              setLimit(nl);
              setOffset(no);
            }}
          />
        </Flex>
      ) : (
        <Text fontSize="sm" color="fg.muted">{t("ui.state.no_data")}</Text>
      )}
    </Flex>
  );
};

const UsersTab = ({ initialUsers }: { initialUsers: UserData[] }) => {
  const { t } = useTranslation();
  const { usersQuery, fetchUsers, updateUser, deleteUser } = useAdmin();
  const [editing, setEditing] = useState<
    Record<number, { username: string; email: string; role: string }>
  >({});
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [usersPage, setUsersPage] = useState<UsersResponse | null>(null);

  useEffect(() => {
    if (initialUsers?.length && !usersPage) {
      // Use initial users if available to populate first page
      setUsersPage({ data: initialUsers, meta: { total: initialUsers.length, limit: 100, offset: 0 } });
    } else if (!usersPage) {
      load({ limit, offset });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUsers]);

  const load = async (params?: { limit?: number; offset?: number }) => {
    const l = params?.limit ?? limit;
    const o = params?.offset ?? offset;
    setLoading(true);
    const res = await fetchUsers({ limit: l, offset: o });
    setLoading(false);
    if (res) {
      setUsersPage(res);
      setLimit(res.meta?.limit ?? l);
      setOffset(res.meta?.offset ?? o);
    }
  };

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
    await load();
    cancelEdit(id);
  };

  return (
    <Flex direction="column" gap={2}>
      <Flex>
        <Button size="sm" onClick={() => load()}>{t("ui.actions.refresh")}</Button>
      </Flex>
      {(loading || usersQuery.isFetching) && (
        <Text fontSize="sm" color="fg.muted">{t("ui.state.loading")}</Text>
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
                        <Button size="xs" variant="ghost" onClick={() => startEdit(u)}>
                          {t("ui.actions.edit")}
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorPalette="red"
                          onClick={async () => {
                            await deleteUser(u.id);
                            await load();
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
        <Text fontSize="sm" color="fg.muted">{t("ui.state.no_data")}</Text>
      )}

      {usersPage?.meta ? (
        <Paginator
          total={usersPage.meta.total}
          limit={limit}
          offset={offset}
          onChange={({ limit: nl, offset: no }) => {
            setLimit(nl);
            setOffset(no);
            load({ limit: nl, offset: no });
          }}
        />
      ) : null}
    </Flex>
  );
};

const Admin = () => {
  usePageNav("nav.admin");
  const { t } = useTranslation();
  const { fetchUsers } = useAdmin();
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      // Fetch a larger chunk for dropdowns, e.g. 100
      const res = await fetchUsers({ limit: 100, offset: 0 });
      if (res?.data) {
        setUsers(res.data);
      }
    };
    loadUsers();
  }, []);

  return (
    <Flex direction="column" flex={1} overflowY="auto" p={4} gap={4}>
      <Tabs.Root defaultValue="analytics">
        <Tabs.List>
          <Tabs.Trigger value="analytics">{t("admin.analytics")}</Tabs.Trigger>
          <Tabs.Trigger value="actions">{t("admin.actionStats")}</Tabs.Trigger>
          <Tabs.Trigger value="userstats">{t("admin.userStats")}</Tabs.Trigger>
          <Tabs.Trigger value="users">{t("admin.users")}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.ContentGroup paddingTop={1}>
          <Tabs.Content value="analytics">
            <AnalyticsTab users={users} />
          </Tabs.Content>
          <Tabs.Content value="actions">
            <ActionsTab />
          </Tabs.Content>
          <Tabs.Content value="userstats">
            <UserStatsTab />
          </Tabs.Content>
          <Tabs.Content value="users">
            <UsersTab initialUsers={users} />
          </Tabs.Content>
        </Tabs.ContentGroup>
      </Tabs.Root>
    </Flex>
  );
};

export default Admin;
