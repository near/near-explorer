import { renderI18nElement } from "../../../libraries/tester";

import AccountLink from "../AccountLink";

describe("<AccountLink />", () => {
  it("renders short account id", () => {
    expect(
      renderI18nElement(<AccountLink accountId="jerry.zest.near" />)
    ).toMatchSnapshot();
  });
  it("renders long account id", () => {
    expect(
      renderI18nElement(
        <AccountLink accountId="b7df2090560a225dc4934aed43db03a6c674c2d4.lockup.near" />
      )
    ).toMatchSnapshot();
  });
});
