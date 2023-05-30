import * as React from "react";

import { AccountLink } from "@/frontend/components/utils/AccountLink";
import { renderElement } from "@/frontend/testing/utils";

describe("<AccountLink />", () => {
  it("renders short account id", () => {
    expect(
      renderElement(<AccountLink accountId="jerry.zest.near" />)
    ).toMatchSnapshot();
  });
  it("renders long account id", () => {
    expect(
      renderElement(
        <AccountLink accountId="b7df2090560a225dc4934aed43db03a6c674c2d4.lockup.near" />
      )
    ).toMatchSnapshot();
  });
});
