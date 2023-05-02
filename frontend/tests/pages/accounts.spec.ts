import { expect } from "@playwright/test";

import { openFixture as test } from "@explorer/frontend/tests/fixtures";

const accountsPerPage = 15;

test.describe("Accounts page", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath("/accounts");
  });

  test("Header is 'Accounts'", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Accounts");
  });

  test(`There are ${accountsPerPage} account rows on load`, async ({
    page,
  }) => {
    await expect(page.locator("class=TransactionRow")).toHaveCount(
      accountsPerPage
    );
  });

  test("Rows are not empty", async ({ page }) => {
    const row = page.locator("class=TransactionRow");
    await expect(row.locator("class=TransactionRowTitle")).toHaveText(
      new Array(accountsPerPage).fill(null).map(() => /.{6,64}/)
    );
    await expect(
      row.locator("class=TransactionRowTransactionId").locator("span")
      // eslint-disable-next-line no-irregular-whitespace
    ).toHaveText(new Array(accountsPerPage).fill(null).map(() => /[.\d]+? Ⓝ/));
  });

  test(`There are ${accountsPerPage * 2} account rows on scroll`, async ({
    page,
  }) => {
    const row = page.locator("class=TransactionRow");
    await row.first().waitFor();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(row).toHaveCount(accountsPerPage * 2);
  });

  test("Row click gets you on account page", async ({ page }) => {
    await page.locator("class=TransactionRow").first().click();
    await page.waitForURL(/\/accounts\/.+/);
  });
});
