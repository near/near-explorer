import { renderI18nElement } from "../../../libraries/tester";

import TransactionDetails from "../TransactionDetails";

import { TRANSACTIONS } from "./common";

describe("<TransactionDetails />", () => {
  it("renders no deposit", () => {
    expect(
      renderI18nElement(<TransactionDetails transaction={TRANSACTIONS[0]} />)
    ).toMatchSnapshot();
  });
  it("renders with one small deposit", () => {
    expect(
      renderI18nElement(<TransactionDetails transaction={TRANSACTIONS[1]} />)
    ).toMatchSnapshot();
  });
  it("renders with two big deposit", () => {
    expect(
      renderI18nElement(<TransactionDetails transaction={TRANSACTIONS[2]} />)
    ).toMatchSnapshot();
  });
});
