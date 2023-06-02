import { expect } from "@playwright/test";

import { openFixture as test } from "@/frontend/tests/fixtures";

const transactionsPerPage = 15;

test.describe("Transactions page", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath("/transactions");
  });

  test("Header is 'Transactions'", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Transactions");
  });

  test(`There are ${transactionsPerPage} transaction rows on load`, async ({
    page,
  }) => {
    await expect(page.locator("class=ActionRow")).toHaveCount(
      transactionsPerPage
    );
  });

  test("Rows are not empty", async ({ page }) => {
    const row = page.getByTestId("transaction-item");
    await expect(row.locator("class=ActionRowTitle")).toContainText(
      new Array(transactionsPerPage).fill(null).map(() => /.{5}/)
    );
    await expect(row.locator("class=ActionRowText")).toHaveText(
      new Array(transactionsPerPage).fill(null).map(() => /by .+/)
    );
    await expect(row.locator("class=ActionRowTransaction")).toHaveText(
      new Array(transactionsPerPage).fill(null).map(() => /[a-zA-Z\d]{7}.../)
    );
  });

  test(`There are ${transactionsPerPage * 2} account rows on scroll`, async ({
    page,
  }) => {
    const row = page.getByTestId("transaction-item");
    await row.first().waitFor();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(row).toHaveCount(transactionsPerPage * 2);
  });

  test("Row click gets you on transaction page", async ({ page }) => {
    await page
      .locator("class=ActionRowTransaction")
      .locator("a")
      .first()
      .click();
    await page.waitForURL(/\/transactions\/.+/);
  });
});
