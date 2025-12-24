import { usePageNav } from "@/hooks/usePageNav";
import { Flex, Tabs } from "@chakra-ui/react";
import { useEffect, useState, useCallback, useEffectEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/util/trpc";
import { AnalyticsTab } from "@/components/Pages/Admin/AnalyticsTab";
import { ActionsTab } from "@/components/Pages/Admin/ActionsTab";
import { UserStatsTab } from "@/components/Pages/Admin/UserStatsTab";
import { UsersTab } from "@/components/Pages/Admin/UsersTab";

const Admin = () => {
  usePageNav("nav.admin");
  const { t } = useTranslation();
  const trpc = useTRPC();

  const [activeTab, setActiveTab] = useState("analytics");
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());

  // Shared users query for dropdowns
  const listUsersQueryOptions = trpc.admin.listUsers.queryOptions({
    limit: 100,
    offset: 0,
  });
  const { data: users } = useQuery({
    ...listUsersQueryOptions,
    initialData: { data: [], meta: { total: 0, limit: 100, offset: 0 } },
  });

  // Shared queries - disabled by default, manually triggered
  const analyticsQuery = useQuery({
    ...trpc.admin.getAnalytics.queryOptions({ limit: 20, offset: 0 }),
    enabled: false,
  });

  const actionStatsQuery = useQuery({
    ...trpc.admin.getActionStats.queryOptions(),
    enabled: false,
  });

  const userStatsQuery = useQuery({
    ...trpc.admin.getUserStats.queryOptions(),
    enabled: false,
  });

  const handleTabChange = useCallback((details: { value: string }) => {
    setActiveTab(details.value);
  }, []);

  const loadTabData = useEffectEvent(() => {
    switch (activeTab) {
      case "analytics":
        analyticsQuery.refetch();
        break;
      case "actions":
        actionStatsQuery.refetch();
        break;
      case "userstats":
        userStatsQuery.refetch();
        break;
      // Users tab handles its own fetching via react-query
    }
    setLoadedTabs((prev) => new Set(prev).add(activeTab));
  });

  // Auto-fetch data when tab becomes active (only first time)
  useEffect(() => {
    if (loadedTabs.has(activeTab)) return;

    loadTabData();
  }, [activeTab, loadedTabs, analyticsQuery, actionStatsQuery, userStatsQuery]);

  return (
    <Flex direction="column" flex={1} overflowY="auto" p={4} gap={4}>
      <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Trigger value="analytics">{t("admin.analytics")}</Tabs.Trigger>
          <Tabs.Trigger value="actions">{t("admin.actionStats")}</Tabs.Trigger>
          <Tabs.Trigger value="userstats">{t("admin.userStats")}</Tabs.Trigger>
          <Tabs.Trigger value="users">{t("admin.users")}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.ContentGroup paddingTop={1}>
          <Tabs.Content value="analytics">
            <AnalyticsTab users={users.data} analyticsQuery={analyticsQuery} />
          </Tabs.Content>
          <Tabs.Content value="actions">
            <ActionsTab actionStatsQuery={actionStatsQuery} />
          </Tabs.Content>
          <Tabs.Content value="userstats">
            <UserStatsTab userStatsQuery={userStatsQuery} />
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
