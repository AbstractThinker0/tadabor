import { Box, Flex, Text } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Paginator } from "@/components/Generic/Paginator";
import { useQueryUserStats } from "@/services/backend";

type UserStatsQuery = Pick<
  ReturnType<typeof useQueryUserStats>,
  "data" | "isFetching"
>;

type UserStatsRow = {
  userId: number;
  username: string | null;
  count: number;
};

interface UserStatsTabProps {
  userStatsQuery: UserStatsQuery;
}

export const UserStatsTab = ({ userStatsQuery }: UserStatsTabProps) => {
  const { t } = useTranslation();
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  const { data, total, pageSlice, max } = useMemo(() => {
    const safeData: UserStatsRow[] = (userStatsQuery.data ?? []).map((row) => ({
      userId: row.userId,
      username: row.username,
      count: typeof row.count === "number" ? row.count : Number(row.count) || 0,
    }));
    const safeTotal = safeData.length;

    const safeMax = safeData.reduce(
      (m: number, r) => Math.max(m, r.count),
      0
    );

    const safePageSlice = safeData.slice(
      offset,
      Math.min(offset + limit, safeTotal)
    );

    return {
      data: safeData,
      total: safeTotal,
      pageSlice: safePageSlice,
      max: safeMax,
    };
  }, [userStatsQuery.data, offset, limit]);

  return (
    <Flex direction="column" gap={2}>
      {userStatsQuery.isFetching && (
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
              <Flex key={row.userId} gap={2} align="center" fontSize="sm">
                <Box
                  w="200px"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {row.username ?? row.userId}
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
                    w={
                      max
                        ? `${Math.round((row.count / max) * 100)}%`
                        : "0%"
                    }
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
