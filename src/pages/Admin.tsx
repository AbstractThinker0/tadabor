import { usePageNav } from "@/hooks/usePageNav";
import { useAdmin } from "@/hooks/useAdmin";
import { Flex, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { UserData } from "@/types/admin";
import { AnalyticsTab } from "@/components/Pages/Admin/AnalyticsTab";
import { ActionsTab } from "@/components/Pages/Admin/ActionsTab";
import { UserStatsTab } from "@/components/Pages/Admin/UserStatsTab";
import { UsersTab } from "@/components/Pages/Admin/UsersTab";

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
