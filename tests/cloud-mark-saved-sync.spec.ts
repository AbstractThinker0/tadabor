import { expect, test } from "@playwright/test";

test.describe("cloudNotes markSaved date_synced regression", () => {
  test("mirrors saveData.date_synced into zustand state on offline save", async ({
    page,
  }) => {
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
          message: `Unexpected RPC request during markSaved regression: ${path}`,
        }),
      });
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible({ timeout: 20_000 });

    await page.evaluate(async () => {
      const cloudNotesModulePath = "/src/store/global/cloudNotes.ts" as string;
      const dbModulePath = "/src/util/db.ts" as string;

      const { useCloudNotesStore } = await import(cloudNotesModulePath);
      const { db } = await import(dbModulePath);

      const noteId = "verse:9-99";

      useCloudNotesStore.getState().reset();
      await db.cloud_notes.where("id").equals(noteId).delete();

      // Seed a previously synced cloud note.
      useCloudNotesStore.getState().cacheNote({
        id: noteId,
        uuid: "00000000-0000-4000-8000-000000000999",
        authorId: 7,
        key: "9-99",
        type: "verse",
        text: "Original cloud note",
        dir: "",
        date_created: 100,
        date_modified: 100,
        date_synced: 100,
        isNew: false,
      });
    });

    await expect.poll(() => page.evaluate(async () => {
      const dbModulePath = "/src/util/db.ts" as string;
      const { db } = await import(dbModulePath);
      return (await db.cloud_notes.get("verse:9-99"))?.date_synced;
    })).toBe(100);

    const result = await page.evaluate(async () => {
      const cloudNotesModulePath = "/src/store/global/cloudNotes.ts" as string;
      const noteSaveModulePath = "/src/features/notes/noteSave.ts" as string;
      const notesUtilPath = "/src/util/notes.ts" as string;
      const dbModulePath = "/src/util/db.ts" as string;
      const { useCloudNotesStore } = await import(cloudNotesModulePath);
      const { buildCloudNoteSaveData } = await import(noteSaveModulePath);
      const { buildNoteSyncPayload } = await import(notesUtilPath);
      const { db } = await import(dbModulePath);
      const noteId = "verse:9-99";

      // Simulate an offline edit.
      useCloudNotesStore.getState().changeNote({
        name: noteId,
        value: "Offline edited cloud note",
      });

      const changedNote = useCloudNotesStore.getState().data[noteId];

      // Offline save path: buildCloudNoteSaveData always sets date_synced: 0.
      const saveData = buildCloudNoteSaveData({
        noteId,
        note: changedNote,
        noteType: "verse",
        noteDirection: "",
        authorId: 7,
      });

      await useCloudNotesStore.getState().markSaved({ saveData });

      const savedNote = useCloudNotesStore.getState().data[noteId];
      const persistedNote = await db.cloud_notes.get(noteId);
      const syncPayload = buildNoteSyncPayload(
        savedNote,
        savedNote.date_synced ?? 0
      );

      return {
        saveDataSynced: saveData.date_synced,
        stateSynced: savedNote.date_synced ?? null,
        stateModified: savedNote.date_modified ?? 0,
        stateIsSynced: savedNote.isSynced ?? null,
        persistedSynced: persistedNote?.date_synced ?? null,
        syncPayloadLastSynced: syncPayload.dateLastSynced,
      };
    });

    // Sanity: the offline save payload + IndexedDB both carry date_synced 0.
    expect(result.saveDataSynced).toBe(0);
    expect(result.persistedSynced).toBe(0);
    expect(result.stateModified).toBeGreaterThan(100);

    expect(result.stateSynced).toBe(0);
    expect(result.stateIsSynced).toBe(false);
    expect(result.syncPayloadLastSynced).toBe(0);
  });
});
