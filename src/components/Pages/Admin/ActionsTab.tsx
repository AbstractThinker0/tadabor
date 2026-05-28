import { Box, Flex, Text } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Paginator } from "@/components/Generic/Paginator";
import { useQueryActionStats } from "@/services/backend";

type ActionStatsQuery = Pick<
  ReturnType<typeof useQueryActionStats>,
  "data" | "isFetching"
>;

type ActionStatsRow = {
  action: string;
  count: number;
};

interface ActionsTabProps {
  actionStatsQuery: ActionStatsQuery;
}

export const ActionsTab = ({ actionStatsQuery }: ActionsTabProps) => {
  const { t } = useTranslation();
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  const { data, total, pageSlice } = useMemo(() => {
    const safeData: ActionStatsRow[] = (actionStatsQuery.data ?? []).map(
      (row) => ({
        action: row.action,
        count: typeof row.count === "number" ? row.count : Number(row.count) || 0,
      })
    );
    const safeTotal = safeData.length;
    const safePageSlice = safeData.slice(
      offset,
      Math.min(offset + limit, safeTotal)
    );
    return { data: safeData, total: safeTotal, pageSlice: safePageSlice };
  }, [actionStatsQuery.data, offset, limit]);

  return (
    <Flex direction="column" gap={2}>
      {actionStatsQuery.isFetching && (
        <Text fontSize="sm" color="fg.muted">
          {t("ui.state.loading")}
        </Text>
      )}
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
                <Box w="180px" fontWeight="medium">
                  {row.action}
                </Box>
                <Box
                  flex={1}
                  bg="bg.subtle"
                  h="4"
                  rounded="sm"
                  overflow="hidden"
                >
                  <Box
                    h="100%"
                    w={`${row.count}%`}
                    bg="fg.emphasized"
                  />
                </Box>
                <Box w="50px" textAlign="right" fontWeight="bold">
                  {row.count}
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
        <Text fontSize="sm" color="fg.muted">
          {t("ui.state.no_data")}
        </Text>
      )}
    </Flex>
  );
};
