import { expect, test, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";

import {
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
  await expect(page.getByRole("button", { name: "Profile" })).toBeVisible({
    timeout: 20_000,
  });
};

const logout = async (page: Page) => {
  await page.getByRole("button", { name: "Profile" }).click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("userToken"))).toBeNull();
};

test.describe("backend cloud notes integration", () => {
  test("uploads and fetches a cloud note through the browser RPC client", async ({
    page,
  }) => {
    const credentials = await seedBackendUser();
    const uuid = randomUUID();
    const key = "36-58";
    const content = `Browser note ${uuid}`;
    const dateCreated = Date.now() - 1_000;
    const dateModified = Date.now() - 500;

    await enableBackendUi(page);
    await login(page, credentials);

    const note = await page.evaluate(
      async ({ uuid, key, content, dateCreated, dateModified }) => {
        const queryClientModulePath =
          "/src/components/Custom/queryClient.ts" as string;
        const notesModulePath = "/src/util/notes.ts" as string;
        const { getRpcClient } = await import(queryClientModulePath);
        const { fromBackendToDexie, fromDexieToBackend } = await import(
          notesModulePath
        );
        const rpcClient = getRpcClient();
        const uploaded = await rpcClient.notes.uploadNote(
          fromDexieToBackend({
            id: `translation:${key}`,
            uuid,
            authorId: 0,
            key,
            type: "translation",
            text: content,
            dir: "ltr",
            date_created: dateCreated,
            date_modified: dateModified,
            date_synced: 0,
          })
        );
        const fetched = await rpcClient.notes.fetchNote({
          id: `translation:${key}`,
        });

        return {
          uploaded,
          fetched: fromBackendToDexie(fetched.note),
        };
      },
      { uuid, key, content, dateCreated, dateModified }
    );

    expect(note.uploaded.success).toBe(true);
    expect(note.uploaded.note).toMatchObject({ uuid, key });
    expect(note.uploaded.note.dateLastSynced).toBeGreaterThan(dateModified);
    expect(note.fetched).toMatchObject({
      id: `translation:${key}`,
      uuid,
      key,
      type: "translation",
      text: content,
      dir: "ltr",
      date_created: dateCreated,
      date_modified: dateModified,
      date_synced: note.uploaded.note.dateLastSynced,
    });
  });

  test("does not expose a browser-created note to a different account", async ({
    page,
  }) => {
    const owner = await seedBackendUser();
    const otherUser = await seedBackendUser();
    const uuid = randomUUID();
    const key = "112-1";

    await enableBackendUi(page);
    await login(page, owner);

    await page.evaluate(async ({ uuid, key }) => {
      const queryClientModulePath =
        "/src/components/Custom/queryClient.ts" as string;
      const { getRpcClient } = await import(queryClientModulePath);

      await getRpcClient().notes.uploadNote({
        uuid,
        key,
        type: "verse",
        content: "Private browser note",
        direction: "",
        dateCreated: Date.now() - 1_000,
        dateModified: Date.now() - 500,
      });
    }, { uuid, key });

    await logout(page);
    await login(page, otherUser);

    const isAccessible = await page.evaluate(async ({ key }) => {
      const queryClientModulePath =
        "/src/components/Custom/queryClient.ts" as string;
      const { getRpcClient } = await import(queryClientModulePath);

      try {
        await getRpcClient().notes.fetchNote({ id: `verse:${key}` });
        return true;
      } catch {
        return false;
      }
    }, { key });

    expect(isAccessible).toBe(false);
  });
});