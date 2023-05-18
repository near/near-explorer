import { expect } from "@playwright/test";

import { openFixture as test } from "@/frontend/tests/fixtures";

const validatorsPerPage = 120;

test.describe("Validators page", () => {
  test.beforeEach(async ({ openPath }) => {
    await openPath("/nodes/validators");
  });

  test("Header is 'Nodes'", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Nodes");
  });

  test("Epoch data", async ({ page }) => {
    const dataRow = page.locator("class=NodesEpochRow");
    await expect(dataRow.locator(".col")).toHaveText(
      /Current Epoch Start: Block #\d+/
    );
    await expect(dataRow.locator(".text-right.d-md-block")).toHaveText(
      /\d{1,2}% complete \(\d{1,2}:\d{1,2}:\d{1,2} remaining\)/
    );
  });

  test("Info card", async ({ page, getExpectTextInBlock }) => {
    const expectTextInBlock = getExpectTextInBlock(
      ".row.no-gutters",
      "class=InfoCardTitle",
      "class=InfoCardText",
      page.locator("class=InfoCardWrapper")
    );
    await expectTextInBlock("Nodes validating", /.\d+/);
    // eslint-disable-next-line no-irregular-whitespace
    await expectTextInBlock("Total Supply", /[\d,]+?. NEAR/);
    // eslint-disable-next-line no-irregular-whitespace
    await expectTextInBlock("Total Stake", /[\d,]+?. NEAR/);
    // eslint-disable-next-line no-irregular-whitespace
    await expectTextInBlock("Seat Price", /[\d,]+?. NEAR/);
  });

  test("Validator list", async ({ page }) => {
    const table = page.locator("class=ValidatorsWrapper");
    await expect(table.locator("class=TableRowWrapper")).toHaveCount(
      validatorsPerPage
    );
  });
});
