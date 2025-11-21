import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAdmin } from "@/hooks/useAdmin";
import { Paginator } from "@/components/Generic/Paginator";

export const UserStatsTab = () => {
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
