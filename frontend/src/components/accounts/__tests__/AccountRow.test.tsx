import { renderElement } from "@explorer/frontend/testing/utils";

import AccountRow from "@explorer/frontend/components/accounts/AccountRow";

describe("<AccountRow />", () => {
  beforeEach(() => jest.resetAllMocks());

  it("renders with short name", () => {
    expect(renderElement(<AccountRow accountId="account" />)).toMatchSnapshot();
  });

  it("renders with long name", () => {
    expect(
      renderElement(
        <AccountRow accountId="b7df2090560a225dc4934aed43db03a6c674c2d4.lockup.near" />
      )
    ).toMatchSnapshot();
  });
});
