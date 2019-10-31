import renderer from "react-test-renderer";

import TransactionDetails from "../TransactionDetails";

import { TRANSACTIONS } from "./common";

describe("<TransactionDetails />", () => {
  it("renders", () => {
    expect(
      renderer.create(<TransactionDetails transaction={TRANSACTIONS[0]} />)
    ).toMatchSnapshot();
  });
});
