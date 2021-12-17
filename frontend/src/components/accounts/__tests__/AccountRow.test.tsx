import { renderI18nElement } from "../../../libraries/tester";

import AccountRow from "../AccountRow";

describe("<AccountRow />", () => {
  beforeEach(() => jest.resetAllMocks());

  it("renders with short name", () => {
    expect(
      renderI18nElement(<AccountRow accountId="account" />)
    ).toMatchSnapshot();
  });

  it("renders with long name", () => {
    expect(
      renderI18nElement(
        <AccountRow accountId="b7df2090560a225dc4934aed43db03a6c674c2d4.lockup.near" />
      )
    ).toMatchSnapshot();
  });
});
