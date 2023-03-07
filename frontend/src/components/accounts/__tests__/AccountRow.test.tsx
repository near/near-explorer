import * as React from "react";

import AccountRow from "@explorer/frontend/components/accounts/AccountRow";
import { renderElement } from "@explorer/frontend/testing/utils";

describe("<AccountRow />", () => {
  beforeEach(() => jest.resetAllMocks());

  it("renders with short name", () => {
    expect(
      renderElement(
        <AccountRow
          account={{
            id: "account",
            index: 0,
            createdTimestamp: 1601461389590,
            deletedTimestamp: undefined,
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with long name", () => {
    expect(
      renderElement(
        <AccountRow
          account={{
            id: "b7df2090560a225dc4934aed43db03a6c674c2d4.lockup.near",
            index: 0,
            createdTimestamp: 1601461389590,
            deletedTimestamp: undefined,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
