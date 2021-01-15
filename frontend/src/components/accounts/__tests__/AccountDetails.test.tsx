import renderer from "react-test-renderer";

import AccountDetails from "../AccountDetails";

describe("<AccountDetails />", () => {
  it("renders with lockup account", () => {
    expect(
      renderer.create(
        <AccountDetails
          account={{
            accountId: "megan.near",
            inTransactionsCount: 10,
            outTransactionsCount: 7,
            createdAtBlockTimestamp: Number(new Date(2019, 1, 1)),
            createdByTransactionHash:
              "EVvWW1S9BFaEjY1JBNSdstb7ZTtTFjQ6cygkbw1KY4tL",
            stakedBalance: "0",
            nonStakedBalance: "654345665432345678765",
            storageUsage: "876",
            lockupAccountId: "gjturigjgkjnfidsjffjsa.lockup.near",
          }}
          currentNearNetwork={{
            name: "testing",
            explorerLink: "http://explorer/",
            aliases: ["alias1"],
            nearWalletProfilePrefix: "http://wallet/profile",
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders without lockup account", () => {
    expect(
      renderer.create(
        <AccountDetails
          account={{
            accountId: "near.near",
            inTransactionsCount: 10,
            outTransactionsCount: 7,
            createdAtBlockTimestamp: Number(new Date(2019, 1, 1)),
            createdByTransactionHash:
              "EVvWW1S9BFlkjkmnjmkb7ZTtTFjQ6cygkbw1KY4tL",
            stakedBalance: "0",
            nonStakedBalance: "6987876845678765",
            storageUsage: "1876",
          }}
          currentNearNetwork={{
            name: "testing",
            explorerLink: "http://explorer/",
            aliases: ["alias1"],
            nearWalletProfilePrefix: "http://wallet/profile",
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
