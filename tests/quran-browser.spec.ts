import { test, expect } from "@playwright/test";

test.describe("QuranBrowser Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for Quran data to load - the chapter header shows "سورة {name}"
    await expect(page.getByText("سورة الفاتحة")).toBeVisible({
      timeout: 15000,
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
});
