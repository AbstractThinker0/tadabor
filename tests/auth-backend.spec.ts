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
});
