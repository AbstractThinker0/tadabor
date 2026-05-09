import { usePageNav } from "@/hooks/usePageNav";
import { Flex, Tabs } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { AnalyticsTab } from "@/components/Pages/Admin/AnalyticsTab";
import { ActionsTab } from "@/components/Pages/Admin/ActionsTab";
import { UserStatsTab } from "@/components/Pages/Admin/UserStatsTab";
import { UsersTab } from "@/components/Pages/Admin/UsersTab";
import {
  useFetchUsers,
  useQueryActionStats,
  useQueryAnalytics,
  useQueryUserStats,
} from "@/services/backend";

const Admin = () => {
  usePageNav("nav.admin");
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("analytics");
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(
    () => new Set(["analytics"])
  );

  // Shared users query for dropdowns
  const { data: users } = useFetchUsers({ limit: 100, offset: 0 });

  // Shared queries - disabled by default, manually triggered
  const analyticsQuery = useQueryAnalytics(
    { limit: 20, offset: 0 },
    { enabled: loadedTabs.has("analytics") }
  );

  const actionStatsQuery = useQueryActionStats({
    enabled: loadedTabs.has("actions"),
  });

  const userStatsQuery = useQueryUserStats({
    enabled: loadedTabs.has("userstats"),
  });

  const handleTabChange = useCallback((details: { value: string }) => {
    setActiveTab(details.value);
    setLoadedTabs((prev) => {
      if (prev.has(details.value)) {
        return prev;
      }

      return new Set(prev).add(details.value);
    });
  }, []);

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
            <AnalyticsTab users={users!.data} analyticsQuery={analyticsQuery} />
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
