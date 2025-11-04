import { usePageNav } from "@/hooks/usePageNav";
import { useAdmin } from "@/hooks/useAdmin";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Table,
  Tabs,
  Text,
  NativeSelect,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Paginator } from "@/components/Generic/Paginator";

const AnalyticsTab = () => {
  const { t } = useTranslation();
  const { analyticsQuery, fetchAnalytics } = useAdmin();
  const [action, setAction] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState<any>(null);

  const load = async (params?: { limit?: number; offset?: number }) => {
    const l = params?.limit ?? limit;
    const o = params?.offset ?? offset;
    setLoading(true);
    const res: any = await fetchAnalytics({
      userId: userId ? Number(userId) : undefined,
      action: action || undefined,
      limit: l,
      offset: o,
    });
    setLoading(false);
    if (res) {
      setPageData(res as any);
      setLimit(res.meta?.limit ?? l);
      setOffset(res.meta?.offset ?? o);
    }
  };

  return (
    <Flex direction="column" gap={3}>
      <Heading size="sm">Filters</Heading>
      <Flex gap={2} wrap="wrap" align="center">
        <Input
          placeholder={t("admin.userId")}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          type="number"
          w="200px"
        />
        <Input
          placeholder={t("admin.action")}
          value={action}
          onChange={(e) => setAction(e.target.value)}
          w="240px"
        />
        <Button
          onClick={() => {
            setOffset(0);
            load({ limit, offset: 0 });
          }}
        >
          {t("ui.actions.load")}
        </Button>
      </Flex>

      <Heading size="sm">Results</Heading>
      {(loading || analyticsQuery.isFetching) && (
        <Text>{t("ui.state.loading")}</Text>
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
          {pageData.data.map((row: any) => (
            <Box key={row.id} p={3} bg="bg.panel" rounded="md">
              <Flex gap={3} wrap="wrap">
                <Text fontWeight="bold">#{row.id}</Text>
                <Text>{row.action}</Text>
                <Text>user: {row.username ?? row.userId}</Text>
                <Text color="fg.muted">
                  {new Date(row.timestamp).toLocaleString()}
                </Text>
                {row.ipAddress && <Text>ip: {row.ipAddress}</Text>}
              </Flex>
              {(row.oldData || row.newData) && (
                <Flex gap={3} mt={2} wrap="wrap">
                  {row.oldData && (
                    <Box flex={1} minW="260px">
                      <Heading size="sm">old</Heading>
                      <Box
                        as="pre"
                        p={2}
                        bg="brand.bg"
                        rounded="sm"
                        maxH="160px"
                        overflow="auto"
                      >
                        {row.oldData}
                      </Box>
                    </Box>
                  )}
                  {row.newData && (
                    <Box flex={1} minW="260px">
                      <Heading size="sm">new</Heading>
                      <Box
                        as="pre"
                        p={2}
                        bg="brand.bg"
                        rounded="sm"
                        maxH="160px"
                        overflow="auto"
                      >
                        {row.newData}
                      </Box>
                    </Box>
                  )}
                </Flex>
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
        <Text>{t("ui.state.no_data")}</Text>
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
    <Flex direction="column" gap={3}>
      <Button
        onClick={async () => {
          await fetchActionStats();
          setOffset(0);
        }}
      >
        {t("ui.actions.load")}
      </Button>
      <Heading size="sm">Results</Heading>
      {data?.length ? (
        <Flex direction="column" gap={3}>
          <Paginator
            total={total}
            limit={limit}
            offset={offset}
            onChange={({ limit: nl, offset: no }) => {
              setLimit(nl);
              setOffset(no);
            }}
          />
          <Flex direction="column" gap={2}>
            {pageSlice.map((row: any) => (
              <Flex key={row.action} gap={2} align="center">
                <Box w="180px">{row.action}</Box>
                <Box flex={1} bg="brand.bg">
                  <Box h="6" w={`${Number(row.count)}%`} bg="fg.emphasized" />
                </Box>
                <Box w="60px" textAlign="right">
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
        <Text>{t("ui.state.no_data")}</Text>
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
      (m: number, r: any) => Math.max(m, Number(r.count) || 0),
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
    <Flex direction="column" gap={3}>
      <Button
        onClick={async () => {
          await fetchUserStats();
          setOffset(0);
        }}
      >
        {t("ui.actions.load")}
      </Button>
      <Heading size="sm">Results</Heading>
      {data?.length ? (
        <Flex direction="column" gap={3}>
          <Paginator
            total={total}
            limit={limit}
            offset={offset}
            onChange={({ limit: nl, offset: no }) => {
              setLimit(nl);
              setOffset(no);
            }}
          />
          <Flex direction="column" gap={2}>
            {pageSlice.map((row: any) => (
              <Flex key={row.userId} gap={2} align="center">
                <Box w="220px">{row.username ?? row.userId}</Box>
                <Box flex={1} bg="brand.bg">
                  <Box
                    h="6"
                    w={
                      max
                        ? `${Math.round((Number(row.count) / max) * 100)}%`
                        : "0%"
                    }
                    bg="fg.emphasized"
                  />
                </Box>
                <Box w="60px" textAlign="right">
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
        <Text>{t("ui.state.no_data")}</Text>
      )}
    </Flex>
  );
};

const UsersTab = () => {
  const { t } = useTranslation();
  const { usersQuery, fetchUsers, updateUser, deleteUser } = useAdmin();
  const [editing, setEditing] = useState<
    Record<number, { username: string; email: string; role: string }>
  >({});
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [usersPage, setUsersPage] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      await load({ limit, offset });
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async (params?: { limit?: number; offset?: number }) => {
    const l = params?.limit ?? limit;
    const o = params?.offset ?? offset;
    setLoading(true);
    const res: any = await fetchUsers({ limit: l, offset: o });
    setLoading(false);
    if (res) {
      setUsersPage(res as any);
      setLimit(res.meta?.limit ?? l);
      setOffset(res.meta?.offset ?? o);
    }
  };

  const startEdit = (u: any) => {
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
    <Flex direction="column" gap={3}>
      <Flex>
        <Button onClick={() => load()}>{t("ui.actions.refresh")}</Button>
      </Flex>
      <Heading size="sm">Results</Heading>
      {(loading || usersQuery.isFetching) && (
        <Text>{t("ui.state.loading")}</Text>
      )}
      {usersPage?.data?.length ? (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>UUID</Table.ColumnHeader>
              <Table.ColumnHeader>Username</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Role</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {usersPage.data.map((u: any) => {
              const e = editing[u.id];
              return (
                <Table.Row key={u.id}>
                  <Table.Cell>{u.id}</Table.Cell>
                  <Table.Cell>{u.uuid}</Table.Cell>
                  <Table.Cell>
                    {e ? (
                      <Input
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
                      <NativeSelect.Root bgColor={"bg"}>
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
                        <Button size="sm" onClick={() => saveEdit(u.id)}>
                          {t("ui.actions.save")}
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => cancelEdit(u.id)}
                        >
                          {t("ui.actions.cancel")}
                        </Button>
                      </Flex>
                    ) : (
                      <Flex gap={2} justify="flex-end">
                        <Button size="sm" onClick={() => startEdit(u)}>
                          {t("ui.actions.edit")}
                        </Button>
                        <Button
                          size="sm"
                          variant="surface"
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
        <Text>{t("ui.state.no_data")}</Text>
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
            <AnalyticsTab />
          </Tabs.Content>
          <Tabs.Content value="actions">
            <ActionsTab />
          </Tabs.Content>
          <Tabs.Content value="userstats">
            <UserStatsTab />
          </Tabs.Content>
          <Tabs.Content value="users">
            <UsersTab />
          </Tabs.Content>
        </Tabs.ContentGroup>
      </Tabs.Root>
    </Flex>
  );
};

export default Admin;
