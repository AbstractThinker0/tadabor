import { test, expect } from "@playwright/test";

test.describe("QuranBrowser Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for Quran data to load - the chapter header shows "سورة {name}"
    await expect(page.getByText("سورة الفاتحة")).toBeVisible({
      timeout: 20000,
    });
  });

  test("displays chapter name in header", async ({ page }) => {
    // Default chapter is Al-Fatiha (chapter 1)
    await expect(page.getByText("سورة الفاتحة")).toBeVisible();
  });

  test("displays verses for the selected chapter", async ({ page }) => {
    // Al-Fatiha has 7 verses - check that verse buttons exist (verse numbers)
    // Each verse has a button showing its number like "(1)", "(2)", etc.
    await expect(page.getByRole("button", { name: "(1)" })).toBeVisible();
    await expect(page.getByRole("button", { name: "(7)" })).toBeVisible();
  });

  test("can navigate to a different chapter", async ({ page }) => {
    // Click on Al-Baqarah (chapter 2) in the chapter list
    // Chapters are listed as "2. البقرة"
    const chapterItem = page.getByText("2. البقرة");
    await chapterItem.click();

    // Wait for chapter header to update
    await expect(page.getByText("سورة البقرة")).toBeVisible();
  });

  test("redirects to the clicked root occurrence chapter from inspector", async ({
    page,
  }) => {
    test.setTimeout(60_000);

    const verseCard = page.locator('[data-id="1-2"]');
    await expect(verseCard).toBeVisible();

    await verseCard.getByRole("button", { name: "Inspect" }).click();
    await verseCard.locator("span[aria-selected='false']").first().click();
    await verseCard.getByRole("button", { name: /^حمد \(\d+\)$/ }).click();

    const targetOccurrence = verseCard
      .locator('[data-id^="sub-"]:not([data-id="sub-1-2"])')
      .first();
    const targetChapterButton = targetOccurrence.locator("button").first();
    const targetChapter = (await targetChapterButton.textContent())?.trim();

    expect(targetChapter).toBeTruthy();

    await targetChapterButton.click();
    await expect(page.getByText(`سورة ${targetChapter}`)).toBeVisible({
      timeout: 20_000,
    });
  });

  test("can save a guest verse note and load it again after reload", async ({
    page,
  }) => {
    const noteText = `Playwright note ${Date.now()}`;
    const verseCard = page.locator('[data-id="1-2"]');

    await expect(verseCard).toBeVisible();
    await verseCard.getByRole("button", { name: /Expand|توسيع/i }).click();

    const noteEditor = verseCard.locator('textarea:not([aria-hidden="true"])');
    await expect(noteEditor).toBeVisible();
    await noteEditor.fill(noteText);
    await verseCard.locator('button[type="submit"]').click();

    await expect(page.getByText(/Successfully saved\.|تم الحفظ\./)).toBeVisible();

    await page.reload();
    await expect(page.getByText("سورة الفاتحة")).toBeVisible({
      timeout: 20_000,
    });

    const reloadedVerseCard = page.locator('[data-id="1-2"]');
    await reloadedVerseCard
      .getByRole("button", { name: /Expand|توسيع/i })
      .click();

    await expect(reloadedVerseCard.getByText(noteText)).toBeVisible();
    await expect(reloadedVerseCard.locator("textarea")).toHaveCount(0);
  });

  test("keeps the notes list usable when Dexie contains malformed note IDs", async ({
    page,
  }) => {
    const validNoteText = `Valid notes list note ${Date.now()}`;
    const malformedNoteText = `Malformed note ${Date.now()}`;
    const warningMessages: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "warning") {
        warningMessages.push(message.text());
      }
    });

    const verseCard = page.locator('[data-id="1-2"]');

    await expect(verseCard).toBeVisible();
    await verseCard.getByRole("button", { name: /Expand|توسيع/i }).click();

    const noteEditor = verseCard.locator('textarea:not([aria-hidden="true"])');
    await expect(noteEditor).toBeVisible();
    await noteEditor.fill(validNoteText);
    await verseCard.locator('button[type="submit"]').click();

    await expect(page.getByText(/Successfully saved\.|تم الحفظ\./)).toBeVisible();

    await page.evaluate(async ({ malformedNoteText }) => {
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("tadaborDatabase");

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const database = request.result;
          const transaction = database.transaction("local_notes", "readwrite");
          const store = transaction.objectStore("local_notes");

          transaction.oncomplete = () => {
            database.close();
            resolve();
          };
          transaction.onerror = () => {
            reject(transaction.error ?? new Error("Failed to seed malformed note"));
          };

          store.put({
            id: "legacy-id",
            uuid: "00000000-0000-4000-8000-000000000001",
            key: "1-3",
            type: "verse",
            text: malformedNoteText,
            dir: "",
            date_created: Date.now(),
            date_modified: Date.now(),
          });
        };
      });
    }, { malformedNoteText });

    await page.goto("/notes");

    await expect(page.getByRole("button", { name: "Download notes" })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText(validNoteText)).toBeVisible();
    await expect(page.getByText(malformedNoteText)).toHaveCount(0);
    await expect
      .poll(() =>
        warningMessages.some((message) =>
          message.includes("Ignoring malformed note ID while filtering notes:") &&
          message.includes("legacy-id")
        )
      )
      .toBe(true);
  });

  test("warns before reload when a guest note has unsaved changes", async ({
    page,
  }) => {
    const verseCard = page.locator('[data-id="1-2"]');

    await expect(verseCard).toBeVisible();
    await verseCard.getByRole("button", { name: /Expand|توسيع/i }).click();

    const noteEditor = verseCard.locator('textarea:not([aria-hidden="true"])');
    await expect(noteEditor).toBeVisible();
    await noteEditor.fill(`Unsaved note ${Date.now()}`);

    const dialogPromise = page.waitForEvent("dialog");
    const reloadPromise = page.reload({ waitUntil: "domcontentloaded" });

    const dialog = await dialogPromise;
    expect(dialog.type()).toBe("beforeunload");
    await dialog.accept();
    await reloadPromise;

    await expect(page.getByText("سورة الفاتحة")).toBeVisible({
      timeout: 20_000,
    });
  });
});
