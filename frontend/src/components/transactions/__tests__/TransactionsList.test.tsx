import renderer from "react-test-renderer";

import TransactionsList from "../_TransactionsList";

import { TRANSACTIONS } from "./common";

describe("<TransactionsList />", () => {
  it("renders", () => {
    expect(
      renderer.create(<TransactionsList transactions={TRANSACTIONS} />)
    ).toMatchSnapshot();
  });

  it("renders reversed", () => {
    const reversedTransactions = TRANSACTIONS.map(transaction => {
      return { ...transaction, actions: [...transaction.actions].reverse() };
    }).reverse();
    expect(
      JSON.stringify(
        renderer.create(
          <TransactionsList transactions={TRANSACTIONS} reversed />
        )
      )
    ).toEqual(
      JSON.stringify(
        renderer.create(
          <TransactionsList transactions={reversedTransactions} />
        )
      )
    );
  });
});
