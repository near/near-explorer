import { expect } from "@playwright/test";

import { openFixture as test } from "@/frontend/tests/fixtures";

const transactionHash = "9DBhhwpe83X3Dhaw5i6G4ggNTHzawnCJxxKJ3esawKKm";
const actionsAmount = 1;
const receiptsAmount = 2;

test.describe("Transaction page", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath(`/transactions/${transactionHash}`);
  });

  test("Header depicts transaction hash", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(
      `Transaction: ${transactionHash.slice(0, 7)}...${transactionHash.slice(
        -4
      )}`
    );
  });

  test("Transaction details are correct", async ({
    page,
    getExpectTextInBlock,
  }) => {
    const expectTextInBlock = getExpectTextInBlock(
      "class=CardCellWrapper",
      "class=CardCellTitle",
      "class=CardCellText",
      page.locator("class=TransactionInfoContainer")
    );
    await expectTextInBlock("Signed by", /.\.near/);
    await expectTextInBlock("Receiver", /[a-z\d]{5}…[a-z\d]{10}/);
    await expectTextInBlock("Status", "Succeeded");
    await expectTextInBlock(
      "Transaction Fee",
      // eslint-disable-next-line no-irregular-whitespace
      /[\d.]+ Ⓝ/
    );
    await expectTextInBlock(
      "Deposit Value",
      // eslint-disable-next-line no-irregular-whitespace
      /[\d.]+ Ⓝ/
    );
    await expectTextInBlock("Gas Used", /\d+? Tgas/);
    await expectTextInBlock("Attached Gas", /\d+? Tgas/);
    await expectTextInBlock("Created", /.*202\d.*/);
    await expectTextInBlock("Hash", /[a-zA-Z\d]{43,44}/);
    await expectTextInBlock("Block Hash", /[a-zA-Z\d]{43,44}/);
  });

  test("Actions list", async ({ page }) => {
    const actions = page
      .locator("class=ContentContainer")
      .filter({ hasText: "Actions" });
    await expect(actions.locator("class=ActionRow")).toHaveCount(actionsAmount);
  });

  test("Execution plan", async ({ page }) => {
    const actions = page
      .locator("class=ContentContainer")
      .filter({ hasText: "Transaction Execution Plan" });
    await expect(actions.locator("class=ActionRow")).toHaveCount(
      receiptsAmount
    );
  });
});

const invalidTransactionHash = `${transactionHash.slice(0, -1)}x`;

test.describe("Non-existing transaction page", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath(`/transactions/${invalidTransactionHash}`);
  });

  test("Header depicts transaction hash", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(
      `Transaction: ${invalidTransactionHash.slice(
        0,
        7
      )}...${invalidTransactionHash.slice(-4)}`
    );
  });

  test("Description describes missing block", async ({ page }) => {
    await expect(
      page.locator("class=ContentContainer").locator(".container")
    ).toContainText("Transaction not found.");
  });
});
