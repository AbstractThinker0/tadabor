import { expect, test } from "@playwright/test";

import { createOfflineUserSessionFixture } from "./helpers/testFixtures";

interface NoteSyncPayload {
  clientNotes: Array<{
    id: string;
    dateModified: number;
    dateLastSynced: number;
  }>;
  guestNotes: Array<{
    id: string;
    dateModified: number;
    dateLastSynced: number;
  }>;
}

const unwrapRpcPayload = <TPayload>(rawBody: string | null): TPayload => {
  if (!rawBody) {
    return {} as TPayload;
  }

  const parsed = JSON.parse(rawBody) as
    | TPayload
    | { input?: TPayload; json?: TPayload; params?: { input?: TPayload } }
    | Array<{
        input?: TPayload;
        json?: TPayload;
        params?: { input?: TPayload };
      }>;

  if (Array.isArray(parsed)) {
    const firstEntry = parsed[0];

    if (firstEntry?.params?.input) {
      return firstEntry.params.input;
    }

    if (firstEntry?.input) {
      return firstEntry.input;
    }

    if (firstEntry?.json) {
      return firstEntry.json;
    }
  }

  if (parsed && typeof parsed === "object") {
    if ("params" in parsed && parsed.params?.input) {
      return parsed.params.input;
    }

    if ("input" in parsed && parsed.input) {
      return parsed.input;
    }

    if ("json" in parsed && parsed.json) {
      return parsed.json;
    }
  }

  return parsed as TPayload;
};

test.describe("cloud note reconnect sync", () => {
  test("marks previously synced cloud notes as unsynced after offline save", async ({
    page,
  }) => {
    const noteId = "verse:1-2";
    const { userId, authToken, email, username } =
      createOfflineUserSessionFixture();
    const editedText = `Offline cloud edit ${Date.now()}`;
    const initialCloudNote = {
      id: noteId,
      uuid: "00000000-0000-4000-8000-000000000321",
      authorId: userId,
      key: "1-2",
      type: "verse",
      text: "Original cloud note",
      dir: "",
      date_created: 100,
      date_modified: 100,
      date_synced: 100,
      isDeleted: false,
      isPublished: false,
    };

    await page.addInitScript(() => {
      (
        globalThis as { __TADABOR_RPC_URL__?: string }
      ).__TADABOR_RPC_URL__ = `${window.location.origin}/rpc`;
      localStorage.setItem("i18nextLng", "en");
    });

    await page.route("**/rpc/**", async (route) => {
      const path = new URL(route.request().url()).pathname;

      if (path.endsWith("/auth/refresh")) {
        await route.abort("internetdisconnected");
        return;
      }

      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          message: `Unexpected RPC request during offline save regression: ${path}`,
        }),
      });
    });

    await page.goto("/");
    await expect(page.getByText("سورة الفاتحة")).toBeVisible({
      timeout: 20_000,
    });

    await page.evaluate(
      async ({ note }) => {
        const dbModulePath = "/src/util/db.ts" as string;
        const { db } = await import(dbModulePath);
        await db.cloud_notes.put(note);
      },
      { note: initialCloudNote }
    );

    await page.evaluate(
      async ({ userId, authToken, email, username }) => {
        localStorage.setItem("userId", String(userId));
        localStorage.setItem("userToken", authToken);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userUsername", username);

        const userStoreModulePath = "/src/store/global/userStore.ts" as string;
        const { useUserStore } = await import(userStoreModulePath);
        useUserStore.getState().loginOffline();
      },
      { userId, authToken, email, username }
    );

    await expect
      .poll(
        () =>
          page.evaluate(
            async ({ noteId }) => {
              const cloudNotesModulePath =
                "/src/store/global/cloudNotes.ts" as string;
              const { useCloudNotesStore } = await import(cloudNotesModulePath);

              return useCloudNotesStore.getState().data[noteId]?.text ?? null;
            },
            { noteId }
          ),
        { timeout: 20_000 }
      )
      .toBe(initialCloudNote.text);

    const offlineSave = await page.evaluate(
      async ({ noteId, editedText, userId }) => {
        const noteSaveModulePath = "/src/services/noteSave.ts" as string;
        const dbModulePath = "/src/util/db.ts" as string;
        const cloudNotesModulePath =
          "/src/store/global/cloudNotes.ts" as string;
        const { saveCloudNote } = await import(noteSaveModulePath);
        const { db } = await import(dbModulePath);
        const { useCloudNotesStore } = await import(cloudNotesModulePath);

        useCloudNotesStore.getState().changeNote({
          name: noteId,
          value: editedText,
        });

        const changedNote = useCloudNotesStore.getState().data[noteId];
        const result = await saveCloudNote({
          noteId,
          note: changedNote,
          noteType: "verse",
          noteDirection: "",
          authorId: userId,
          markSaved: (saveData) =>
            useCloudNotesStore.getState().markSaved({ saveData }),
          uploadNote: async () => {
            throw new Error("offline");
          },
          updateSyncDate: (payload) =>
            useCloudNotesStore.getState().updateSyncDate(payload),
        });

        const savedNote = useCloudNotesStore.getState().data[noteId];
        const persistedNote = await db.cloud_notes.get(noteId);

        return {
          result,
          savedNote: {
            text: savedNote.text,
            saved: savedNote.saved,
            isSynced: savedNote.isSynced,
            dateModified: savedNote.date_modified ?? 0,
          },
          persistedNote: {
            dateSynced: persistedNote?.date_synced ?? 0,
          },
        };
      },
      { noteId, editedText, userId }
    );

    expect(offlineSave.result).toEqual({ saved: true, synced: false });
    expect(offlineSave.savedNote.text).toBe(editedText);
    expect(offlineSave.savedNote.saved).toBe(true);
    expect(offlineSave.savedNote.isSynced).toBe(false);
    expect(offlineSave.savedNote.dateModified).toBeGreaterThan(
      initialCloudNote.date_modified
    );
    expect(offlineSave.persistedNote.dateSynced).toBe(0);
  });

  test("requests sync for an offline-edited cloud note after the offline session recovers", async ({
    page,
  }) => {
    const noteId = "verse:1-2";
    const { userId, authToken, email, username } =
      createOfflineUserSessionFixture();
    const editedText = `Offline cloud reconnect edit ${Date.now()}`;
    const initialCloudNote = {
      id: noteId,
      uuid: "00000000-0000-4000-8000-000000000321",
      authorId: userId,
      key: "1-2",
      type: "verse",
      text: "Original cloud note",
      dir: "",
      date_created: 100,
      date_modified: 100,
      date_synced: 100,
      isDeleted: false,
      isPublished: false,
    };

    const syncRequests: NoteSyncPayload[] = [];
    await page.addInitScript(() => {
      (
        globalThis as { __TADABOR_RPC_URL__?: string }
      ).__TADABOR_RPC_URL__ = `${window.location.origin}/rpc`;
      localStorage.setItem("i18nextLng", "en");
    });

    await page.route("**/rpc/**", async (route) => {
      const path = new URL(route.request().url()).pathname;

      if (path.endsWith("/auth/refresh")) {
        await route.abort("internetdisconnected");
        return;
      }

      if (path.endsWith("/notes/syncNotes")) {
        const payload = unwrapRpcPayload<NoteSyncPayload>(
          route.request().postData()
        );
        syncRequests.push(payload);

        const noteMeta = payload.clientNotes.find((note) => note.id === noteId);

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            notesToSendToClient: [],
            notesToRequestFromClient:
              noteMeta && noteMeta.dateModified > initialCloudNote.date_modified
                ? [noteId]
                : [],
            notesToRequestFromGuest: [],
          }),
        });
        return;
      }

      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          message: `Unexpected RPC request during reconnect sync regression: ${path}`,
        }),
      });
    });

    await page.goto("/");
    await expect(page.getByText("سورة الفاتحة")).toBeVisible({
      timeout: 20_000,
    });

    await page.context().setOffline(true);

    await page.evaluate(
      async ({ note }) => {
        const dbModulePath = "/src/util/db.ts" as string;
        const { db } = await import(dbModulePath);
        await db.cloud_notes.put(note);
      },
      { note: initialCloudNote }
    );

    await page.evaluate(
      async ({ userId, authToken, email, username }) => {
        localStorage.setItem("userId", String(userId));
        localStorage.setItem("userToken", authToken);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userUsername", username);

        const userStoreModulePath = "/src/store/global/userStore.ts" as string;
        const { useUserStore } = await import(userStoreModulePath);
        useUserStore.getState().loginOffline();
      },
      { userId, authToken, email, username }
    );

    await expect
      .poll(
        () =>
          page.evaluate(
            async ({ noteId }) => {
              const cloudNotesModulePath =
                "/src/store/global/cloudNotes.ts" as string;
              const { useCloudNotesStore } = await import(cloudNotesModulePath);

              return useCloudNotesStore.getState().data[noteId]?.text ?? null;
            },
            { noteId }
          ),
        { timeout: 20_000 }
      )
      .toBe(initialCloudNote.text);

    await page.evaluate(
      async ({ noteId, editedText, userId }) => {
        const noteSaveModulePath = "/src/services/noteSave.ts" as string;
        const cloudNotesModulePath =
          "/src/store/global/cloudNotes.ts" as string;
        const { saveCloudNote } = await import(noteSaveModulePath);
        const { useCloudNotesStore } = await import(cloudNotesModulePath);

        useCloudNotesStore.getState().changeNote({
          name: noteId,
          value: editedText,
        });

        const changedNote = useCloudNotesStore.getState().data[noteId];
        await saveCloudNote({
          noteId,
          note: changedNote,
          noteType: "verse",
          noteDirection: "",
          authorId: userId,
          markSaved: (saveData) =>
            useCloudNotesStore.getState().markSaved({ saveData }),
          uploadNote: async () => {
            throw new Error("offline");
          },
          updateSyncDate: (payload) =>
            useCloudNotesStore.getState().updateSyncDate(payload),
        });
      },
      { noteId, editedText, userId }
    );

    await page.context().setOffline(false);

    await page.evaluate(
      async ({ authToken, userId, email, username }) => {
        const userStoreModulePath = "/src/store/global/userStore.ts" as string;
        const { useUserStore } = await import(userStoreModulePath);

        useUserStore.getState().login({
          token: authToken,
          user: {
            id: userId,
            email,
            username,
            role: 0,
            avatarSeed: String(userId),
            description: "",
          },
        });
      },
      { authToken, userId, email, username }
    );

    await expect
      .poll(
        () =>
          syncRequests.some((payload) =>
            payload.clientNotes.some(
              (note) =>
                note.id === noteId &&
                note.dateModified > initialCloudNote.date_modified
            )
          ),
        { timeout: 25_000 }
      )
      .toBe(true);
  });
});
