import { Button, Flex, Input, Table, Text, NativeSelect } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAdmin } from "@/hooks/useAdmin";
import { Paginator } from "@/components/Generic/Paginator";
import type { UsersResponse, UserData } from "@/types/admin";

export const UsersTab = ({ initialUsers }: { initialUsers: UserData[] }) => {
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
