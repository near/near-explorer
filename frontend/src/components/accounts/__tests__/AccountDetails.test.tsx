import renderer from "react-test-renderer";

import AccountDetails from "../AccountDetails";

describe("<AccountDetails />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <AccountDetails
          account={{
            id: "account",
            amount: "1",
            staked: "1",
            storageUsage: 0,
            storagePaidAt: 1,
            inTransactionsCount: 0,
            outTransactionsCount: 0
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
