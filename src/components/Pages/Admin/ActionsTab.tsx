import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAdmin } from "@/hooks/useAdmin";
import { Paginator } from "@/components/Generic/Paginator";

export const ActionsTab = () => {
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
