import { expect, test, type Page } from "@playwright/test";

import {
  isBackendSessionActive,
  seedBackendUser,
  type BackendSeedCredentials,
} from "./helpers/backend";

const enableBackendUi = async (page: Page) => {
  await page.addInitScript(() => {
    localStorage.setItem("betaVersion", "true");
    localStorage.setItem("i18nextLng", "en");
  });
};

const login = async (page: Page, credentials: BackendSeedCredentials) => {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill(credentials.email);
  await page.locator('input[type="password"]').fill(credentials.password);
  await page.getByRole("button", { name: "Login" }).click();
};

const readUserToken = (page: Page) =>
  page.evaluate(() => localStorage.getItem("userToken"));

const readUserStoreSession = (page: Page) =>
  page.evaluate(async () => {
    const userStoreModulePath = "/src/store/global/userStore.ts" as string;
    const { useUserStore } = await import(userStoreModulePath);
    const { token, tokenRotatedAt } = useUserStore.getState();

    return { token, tokenRotatedAt };
  });

const readUserProfile = (page: Page) =>
  page.evaluate(async () => {
    const userStoreModulePath = "/src/store/global/userStore.ts" as string;
    const { useUserStore } = await import(userStoreModulePath);
    const { id, email, username, role, avatarSeed, description } =
      useUserStore.getState();

    return {
      id,
      email,
      username,
      role,
      avatarSeed,
      description,
    };
  });

test.describe("backend auth integration", () => {
  test("logs in through the UI and revokes the backend session on logout", async ({
    page,
  }) => {
    const credentials = await seedBackendUser();
    const profileButton = page.getByRole("button", { name: "Profile" });

    await enableBackendUi(page);
    await login(page, credentials);

    await expect(profileButton).toBeVisible({ timeout: 20_000 });

    await page.goto("/profile");
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.locator('input[type="email"]')).toHaveValue(
      credentials.email
    );
    await expect(page.getByPlaceholder("Enter your username")).toHaveValue(
      credentials.username
    );

    const token = await readUserToken(page);

    expect(token).toBeTruthy();

    await profileButton.click();
    await page.getByRole("menuitem", { name: "Logout" }).click();

    await expect.poll(() => readUserToken(page)).toBeNull();
    await expect.poll(() => isBackendSessionActive(token ?? "")).toBe(false);
  });

  test("refreshes the auth token on the scheduled interval and re-arms the timeout", async ({
    page,
  }) => {
    const credentials = await seedBackendUser();
    const profileButton = page.getByRole("button", { name: "Profile" });
    const refreshRequests: string[] = [];
    const refreshRequestTimes: number[] = [];
    const servedRefreshSessions: Array<{ token: string; tokenRotatedAt: number }> = [];
    const servedRefreshIssuedAt: number[] = [];
    let currentUser:
      | {
          id: number;
          email: string;
          username: string;
          role: number;
          avatarSeed: string;
          description: string;
        }
      | null = null;

    await page.route("**/rpc/auth/refresh", async (route) => {
      const authorizationHeader = route.request().headers().authorization ?? "";
      const issuedAt = Date.now();
      refreshRequests.push(authorizationHeader);
      refreshRequestTimes.push(issuedAt);

      if (!currentUser) {
        throw new Error("Received scheduled refresh before the user session was captured.");
      }

      const refreshIndex = servedRefreshSessions.length + 1;
      const nextSession = {
        token: `scheduled-refresh-token-${refreshIndex}`,
        tokenRotatedAt: refreshIndex === 1 ? issuedAt + 5_000 : issuedAt,
      };

      servedRefreshSessions.push(nextSession);
      servedRefreshIssuedAt.push(issuedAt);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          json: {
            success: true,
            message: "User token is valid.",
            ...nextSession,
            user: currentUser,
          },
        }),
      });
    });

    await enableBackendUi(page);
    await login(page, credentials);

    await expect(profileButton).toBeVisible({ timeout: 20_000 });

    currentUser = await readUserProfile(page);

    const initialSession = await readUserStoreSession(page);

    await expect
      .poll(
        () => refreshRequests.includes(`Bearer ${initialSession.token}`),
        { timeout: 10_000 }
      )
      .toBe(true);

    await expect
      .poll(
        () =>
          servedRefreshIssuedAt.length > 0 &&
          refreshRequestTimes.some(
            (requestTime) => requestTime - servedRefreshIssuedAt[0] >= 5_000
          ),
        { timeout: 20_000 }
      )
      .toBe(true);

    await expect
      .poll(async () => {
        const session = await readUserStoreSession(page);

        return servedRefreshSessions.some(
          (servedSession) =>
            servedSession.token === session.token &&
            servedSession.tokenRotatedAt === session.tokenRotatedAt
        );
      }, { timeout: 10_000 })
      .toBe(true);
  });
});



