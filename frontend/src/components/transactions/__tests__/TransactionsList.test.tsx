import renderer from "react-test-renderer";

import List from "../../utils/List";

import { TRANSACTIONS } from "./common";

describe("<TransactionsList />", () => {
  it("renders", () => {
    expect(
      renderer.create(<List genre="Transaction" lists={TRANSACTIONS} />)
    ).toMatchSnapshot();
  });

  it("renders reversed", () => {
    const reversedTransactions = TRANSACTIONS.map(transaction => {
      return { ...transaction, actions: [...transaction.actions].reverse() };
    }).reverse();
    expect(
      JSON.stringify(
        renderer.create(
          <List genre="Transaction" lists={TRANSACTIONS} reversed />
        )
      )
    ).toEqual(
      JSON.stringify(
        renderer.create(
          <List genre="Transaction" lists={reversedTransactions} />
        )
      )
    );
  });
});
