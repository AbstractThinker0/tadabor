import { Box, Button, Flex, Input, Text, NativeSelect } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Paginator } from "@/components/Generic/Paginator";
import type { AnalyticsResponse, UserData } from "@/types/admin";
import { useFetchAnalytics } from "@/services/backend";

interface AnalyticsTabProps {
  users: UserData[];
  analyticsQuery: {
    data: AnalyticsResponse | undefined;
    isFetching: boolean;
  };
}

export const AnalyticsTab = ({ users, analyticsQuery }: AnalyticsTabProps) => {
  const { t } = useTranslation();

  const [action, setAction] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Use query data directly, local pageData only for filtered searches
  const [pageData, setPageData] = useState<AnalyticsResponse | null>(null);
  const displayData = pageData ?? analyticsQuery.data ?? null;

  const fetchAnalytics = useFetchAnalytics();

  const load = async (params?: { limit?: number; offset?: number }) => {
    const l = params?.limit ?? limit;
    const o = params?.offset ?? offset;
    setLoading(true);

    try {
      const res = await fetchAnalytics({
        userId: userId ? Number(userId) : undefined,
        action: action || undefined,
        limit: l,
        offset: o,
      });
      if (res) {
        setPageData(res);
        setLimit(res.meta?.limit ?? l);
        setOffset(res.meta?.offset ?? o);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" gap={2}>
      <Flex
        gap={2}
        wrap="wrap"
        align="center"
        bg="bg.subtle"
        p={2}
        rounded="md"
      >
        <NativeSelect.Root size="sm" width="200px">
          <NativeSelect.Field
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
        <Text fontSize="sm" color="fg.muted">
          {t("ui.state.loading")}
        </Text>
      )}

      {displayData?.data?.length ? (
        <Flex direction="column" gap={2}>
          <Paginator
            total={displayData.meta?.total ?? 0}
            limit={limit}
            offset={offset}
            onChange={({ limit: nl, offset: no }) => {
              setLimit(nl);
              setOffset(no);
              load({ limit: nl, offset: no });
            }}
          />
          {displayData.data.map((row) => (
            <Box
              key={row.id}
              p={2}
              bg="bg.panel"
              rounded="md"
              borderWidth="1px"
              fontSize="sm"
            >
              <Flex gap={3} wrap="wrap" align="center">
                <Text fontWeight="bold" minW="40px">
                  #{row.id}
                </Text>
                <Text fontWeight="medium" minW="100px">
                  {row.action}
                </Text>
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
                        <Box
                          flex={1}
                          p={1}
                          bg="bg.subtle"
                          rounded="sm"
                          fontSize="xs"
                        >
                          <Text fontWeight="bold">Old</Text>
                          <Box as="pre" overflow="auto" maxH="100px">
                            {row.oldData}
                          </Box>
                        </Box>
                      )}
                      {row.newData && (
                        <Box
                          flex={1}
                          p={1}
                          bg="bg.subtle"
                          rounded="sm"
                          fontSize="xs"
                        >
                          <Text fontWeight="bold">New</Text>
                          <Box as="pre" overflow="auto" maxH="100px">
                            {row.newData}
                          </Box>
                        </Box>
                      )}
                    </Flex>
                  </details>
                </Box>
              )}
            </Box>
          ))}
          <Paginator
            total={displayData.meta?.total ?? 0}
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
        <Text fontSize="sm" color="fg.muted">
          {t("ui.state.no_data")}
        </Text>
      )}
    </Flex>
  );
};
