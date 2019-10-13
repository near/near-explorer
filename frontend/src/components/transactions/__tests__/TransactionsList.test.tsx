import renderer from "react-test-renderer";

import TransactionsList from "../TransactionsList";

import { TRANSACTIONS } from "./common";

describe("<TransactionsList />", () => {
  it("renders", () => {
    expect(
      renderer.create(<TransactionsList transactions={TRANSACTIONS} />)
    ).toMatchSnapshot();
  });
});
