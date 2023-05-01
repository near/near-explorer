import { expect } from "@playwright/test";

import { openFixture as test } from "@explorer/frontend/tests/fixtures";

const blockHash = "AtSUk7AP4aij3J8ro3n4PKFFB9MmRc6RJ4kHeTqhznCc";
const transactionsAmount = 7;
const includedInBlockAmount = 9;
const executedInBlockAmount = 10;

test.describe("Block page", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath(`/blocks/${blockHash}`);
  });

  test("Header depicts block id", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Block #82744848");
  });

  test("Block details are correct", async ({ page, getExpectTextInBlock }) => {
    const expectTextInBlock = getExpectTextInBlock(
      "class=CardCellWrapper",
      "class=CardCellTitle",
      "class=CardCellText",
      page.locator("class=BlockInfoContainer")
    );
    await expectTextInBlock("Transactions", /\d+/);
    await expectTextInBlock("Receipts", /\d+/);
    await expectTextInBlock("Status", "Finalized");
    await expectTextInBlock("Author", /.\.near/);
    await expectTextInBlock("Gas Used", /\d+? Tgas/);
    await expectTextInBlock("Gas Price", /[.\d]+ Ⓝ\/Tgas/);
    await expectTextInBlock("Created", /.*202\d.*/);
    await expectTextInBlock("Hash", blockHash);
    await expectTextInBlock("Parent Hash", /[a-zA-Z\d]{43,44}/);
  });

  test("Transactions list", async ({ page }) => {
    const transactions = page
      .locator("class=ContentContainer")
      .filter({ hasText: "Transactions" });
    await expect(transactions.locator("class=ActionRow")).toHaveCount(
      transactionsAmount
    );
  });

  test("Included in block list", async ({ page }) => {
    const transactions = page.locator("class=ContentContainer").filter({
      hasText: "Receipts included in this block",
    });
    await expect(transactions.locator("class=ActionRow")).toHaveCount(
      includedInBlockAmount
    );
  });

  test("Executed in block list", async ({ page }) => {
    const transactions = page
      .locator("class=ContentContainer")
      .filter({ hasText: "Receipts executed in this block" });
    await expect(transactions.locator("class=ActionRow")).toHaveCount(
      executedInBlockAmount
    );
  });
});

const invalidBlockHash = blockHash.slice(0, -1);

test.describe("Non-existing block page", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath(`/blocks/${invalidBlockHash}`);
  });

  test("Header depicts block hash", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(
      `Block ${invalidBlockHash.slice(0, 7)}...`
    );
  });

  test("Description describes missing block", async ({ page }) => {
    await expect(
      page.locator("class=ContentContainer").first().locator(".container")
    ).toContainText(`Block not found.`);
  });

  test("Transaction blocks are empty", async ({ getExpectTextInBlock }) => {
    const expectTextInBlock = getExpectTextInBlock(
      "class=ContentContainer",
      "class=ContentHeader",
      "class=PlaceholderWrapper"
    );
    await expectTextInBlock("Transactions", "There are no transactions");
    await expectTextInBlock(
      "Receipts included in this block",
      "There are no receipts in this block"
    );
    await expectTextInBlock(
      "Receipts executed in this block",
      "There are no receipts in this block"
    );
  });
});
