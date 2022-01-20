import { renderElement } from "../../../testing/utils";

import TransactionDetails from "../TransactionDetails";

import { TRANSACTIONS } from "./common";

describe("<TransactionDetails />", () => {
  it("renders no deposit", () => {
    expect(
      renderElement(<TransactionDetails transaction={TRANSACTIONS[0]} />)
    ).toMatchSnapshot();
  });
  it("renders with one small deposit", () => {
    expect(
      renderElement(<TransactionDetails transaction={TRANSACTIONS[1]} />)
    ).toMatchSnapshot();
  });
  it("renders with two big deposit", () => {
    expect(
      renderElement(<TransactionDetails transaction={TRANSACTIONS[2]} />)
    ).toMatchSnapshot();
  });
});
