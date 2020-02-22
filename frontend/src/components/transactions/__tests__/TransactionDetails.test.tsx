import renderer from "react-test-renderer";

import TransactionDetails from "../TransactionDetails";

import { TRANSACTIONS } from "./common";

describe("<TransactionDetails />", () => {
  it("renders no deposit", () => {
    expect(
      renderer.create(<TransactionDetails transaction={TRANSACTIONS[0]} />)
    ).toMatchSnapshot();
  });
  it("renders with one small deposit", () => {
    expect(
      renderer.create(<TransactionDetails transaction={TRANSACTIONS[1]} />)
    ).toMatchSnapshot();
  });
  it("renders with two big deposit", () => {
    expect(
      renderer.create(<TransactionDetails transaction={TRANSACTIONS[2]} />)
    ).toMatchSnapshot();
  });
});
