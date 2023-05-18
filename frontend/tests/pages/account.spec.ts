import { expect } from "@playwright/test";

import { openFixture as test } from "@/frontend/tests/fixtures";

test.describe("Permanent irregular case redirects", () => {
  ["something.near", "sOmEtHiNg.near", "something.NEAR"].forEach(
    (accountId) => {
      test(`Redirect from /accounts/${accountId} to /accounts/${accountId.toLowerCase()}`, async ({
        page,
        openPath,
      }) => {
        const response = await openPath(`/accounts/${accountId}`);
        if (accountId !== accountId.toLowerCase()) {
          const redirectedFrom = response?.request().redirectedFrom();
          const redirectedFromUrl = redirectedFrom?.url();
          const redirectedFromStatus = (
            await redirectedFrom?.response()
          )?.status();
          expect(redirectedFromStatus).toEqual(308);
          expect(redirectedFromUrl).toContain(
            `/accounts/${accountId}?locale=en`
          );
        }
        await page.waitForURL(`/accounts/${accountId.toLowerCase()}?locale=en`);
      });
    }
  );
});

const accountId = "code.near";
const transactionsAmount = 10;

test.describe("Account page", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath(`/accounts/${accountId}`);
  });

  test("Header depicts account id", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(`Account: @${accountId}`);
  });

  test("Account details are correct", async ({
    page,
    getExpectTextInBlock,
  }) => {
    const expectTextInBlock = getExpectTextInBlock(
      "class=CardCellWrapper",
      "class=CardCellTitle",
      "class=CardCellText",
      page.locator("class=AccountInfoContainer")
    );
    await expectTextInBlock("Transactions", /↑\d+↓\d+/);
    await expectTextInBlock("Storage Used", /\d+ k?B/);
    await expectTextInBlock(
      "Ⓝ Native Account Balance",
      // eslint-disable-next-line no-irregular-whitespace
      /[\d.]+ Ⓝ/
    );
    await expectTextInBlock(
      "Ⓝ Validator Stake",
      // eslint-disable-next-line no-irregular-whitespace
      /[\d.]+ Ⓝ/
    );
    await expectTextInBlock("Ⓝ Balance Profile", `${accountId} on Wallet`);
    await expectTextInBlock("Created At", /.*202\d.*/);
    await expectTextInBlock("Created By Transaction", /[a-zA-Z\d]{43,44}/);
  });

  test("Contract details are corrent", async ({
    page,
    getExpectTextInBlock,
  }) => {
    const expectTextInBlock = getExpectTextInBlock(
      "class=CardCellWrapper",
      "class=CardCellTitle",
      "class=CardCellText",
      page.locator("class=ContractInfoContainer")
    );
    await expectTextInBlock("Last Updated", /.*202\d.*/);
    await expectTextInBlock("Transaction Hash", /[a-zA-Z\d]{43,44}/);
    await expectTextInBlock("Locked?", /(Yes|No)/);
    await expectTextInBlock("Code Hash", /[a-zA-Z\d]{43}/);
  });

  test("Transaction list", async ({ page }) => {
    await expect(page.locator("h2")).toHaveText("Transactions");
    await expect(page.locator("class=ActionRow")).toHaveCount(
      transactionsAmount
    );
  });
});

const invalidAccountId = accountId.slice(0, -1);

test.describe("Non-existing account page", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath(`/accounts/${invalidAccountId}`);
  });

  test("Header depicts account id", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(
      `Account: @${invalidAccountId}`
    );
  });

  test("Description describes missing account", async ({ page }) => {
    await expect(
      page.locator("class=ContentContainer").locator(".container")
    ).toContainText(`Account not found.`);
  });
});
