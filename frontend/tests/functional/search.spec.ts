import { expect } from "@playwright/test";

import { openFixture as test } from "@/frontend/tests/fixtures";

const accountId = "test.near";
const blockId = "FU129W1kwzgKZxekDpsELqPWJaUM3uaxhrb3F7cEBkT8";
const transactionHash = "61FRH8ekiPwQuENZZvEnZotQoeYDPcR8umrs3gqeomh6";
const receiptId = "DrTgCo5NvhdpV1QTumTJsok53rdD4yaDgjhczjX2cP1W";

test.describe("Search bar", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath("/");
  });

  test("Search data stays in query", async ({ page }) => {
    const input = page.locator("class=SearchBox").locator("input:visible");
    await input.fill(blockId);
    await page.waitForURL(`/?locale=en&query=${blockId}`);
  });

  test("Account transition", async ({ page }) => {
    const input = page.locator("class=SearchBox").locator("input:visible");
    await input.fill(accountId);
    await page.locator("class=ButtonSearch").click();
    await page.waitForURL(`/accounts/${accountId}`);
  });

  test("Block transition", async ({ page }) => {
    const input = page.locator("class=SearchBox").locator("input:visible");
    await input.fill(blockId);
    await page.locator("class=ButtonSearch").click();
    await page.waitForURL(`/blocks/${blockId}`);
  });

  test("Transaction transition", async ({ page }) => {
    const input = page.locator("class=SearchBox").locator("input:visible");
    await input.fill(transactionHash);
    await page.locator("class=ButtonSearch").click();
    await page.waitForURL(`/transactions/${transactionHash}`);
  });

  test("Receipt transition", async ({ page }) => {
    const input = page.locator("class=SearchBox").locator("input:visible");
    await input.fill(receiptId);
    await page.locator("class=ButtonSearch").click();
    await page.waitForURL(`/transactions/${transactionHash}#${receiptId}`);
  });

  test("Nothing found", async ({ page, waitForAlert }) => {
    const input = page.locator("class=SearchBox").locator("input:visible");
    await input.fill("jibberish");
    const alert = await waitForAlert(() =>
      page.locator("class=ButtonSearch").click()
    );
    expect(alert.message()).toBe("Result not found!");
  });
});
