import { expect } from "@playwright/test";

import { openFixture as test } from "@explorer/frontend/tests/fixtures";

test.describe("Dashboard page", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath("/");
  });

  test("Header is correct", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText(
      "Explore the \nNEAR Blockchain."
    );
  });

  test("Nodes block details are correct", async ({
    page,
    getExpectTextInBlock,
  }) => {
    const block = page.getByTestId("dashboard-nodes");
    await expect(block.locator("class=DashboardCardHeader")).toHaveText(
      "Nodes"
    );
    const expectTextInBlock = getExpectTextInBlock(
      "class=LongCardCellWrapper",
      "class=LongCardCellTitle",
      "class=CardCellText",
      block
    );
    await expectTextInBlock("Nodes online", /\d+/);
    await expectTextInBlock("Node validating", /\d+/);
  });

  test("Blocks block details are correct", async ({
    page,
    getExpectTextInBlock,
  }) => {
    const block = page.getByTestId("dashboard-blocks");
    await expect(
      block.locator("class=DashboardCardHeader").locator(".col")
    ).toHaveText("Blocks");
    const expectTextInBlock = getExpectTextInBlock(
      "class=LongCardCellWrapper",
      "class=LongCardCellTitle",
      "class=CardCellText",
      block
    );
    await expectTextInBlock("Block Height", /[\d,]+/);
    await expectTextInBlock("Avg block time", /[\d.]+ s/);
  });

  test("Transactions block details are correct", async ({
    page,
    getExpectTextInBlock,
  }) => {
    const block = page.getByTestId("dashboard-transactions");
    await expect(
      block.locator("class=DashboardCardHeader").locator(".col")
    ).toHaveText("Transactions");
    const expectTextInBlock = getExpectTextInBlock(
      "class=LongCardCellWrapper",
      "class=LongCardCellTitle",
      "class=CardCellText",
      block
    );
    await expectTextInBlock("24hr Total", /[\d,]+/);
    await expectTextInBlock("Gas Price", /[\d.]+ Ⓝ\/Tgas/);
    await expect(block.locator("class=TransactionCharts")).toBeVisible();
    await expect(block.locator("text=View All")).toHaveAttribute(
      "href",
      "/transactions"
    );
  });
});
