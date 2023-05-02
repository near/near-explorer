import { expect } from "@playwright/test";

import { openFixture as test } from "@explorer/frontend/tests/fixtures";

const blocksPerPage = 15;

test.describe("Blocks page", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath("/blocks");
  });

  test("Header is 'Blocks'", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Blocks");
  });

  test(`There are ${blocksPerPage} account rows on load`, async ({ page }) => {
    await expect(page.locator("class=TransactionRow")).toHaveCount(
      blocksPerPage
    );
  });

  test("Rows are not empty", async ({ page }) => {
    const row = page.locator("class=TransactionRow");
    await expect(row.locator("class=TransactionRowTitle")).toHaveText(
      new Array(blocksPerPage).fill(null).map(() => /#\d+/)
    );
    await expect(row.locator("class=TransactionRowText")).toHaveText(
      new Array(blocksPerPage).fill(null).map(() => / \d+/)
    );
    await expect(row.locator("class=TransactionRowTransactionId")).toHaveText(
      new Array(blocksPerPage).fill(null).map(() => /[a-zA-Z\d]{7}.../)
    );
  });

  test(`There are ${blocksPerPage * 2} account rows on scroll`, async ({
    page,
  }) => {
    const row = page.locator("class=TransactionRow");
    await row.first().waitFor();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(row).toHaveCount(blocksPerPage * 2);
  });

  test("Row click gets you on block page", async ({ page }) => {
    await page.locator("class=TransactionRow").first().click();
    await page.waitForURL(/\/blocks\/.+/);
  });
});
