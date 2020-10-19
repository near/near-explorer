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
            accountIndex: 1234567890,
            stakedBalance: "0",
            nonStakedBalance: "654345665432345678765",
            minimumBalance: "87600000000000",
            availableBalance: "43454321345678765432345678",
            totalBalance: "9876545678765432134567876543",
            storageUsage: "876",
            lockupTotalBalance: "765654565324543",
            lockupAccountId: "gjturigjgkjnfidsjffjsa.lockup.near",
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
            accountIndex: 1234567890,
            stakedBalance: "0",
            nonStakedBalance: "6987876845678765",
            minimumBalance: "187600000000000",
            availableBalance: "434345678765432345678",
            totalBalance: "98765445654565134567876543",
            storageUsage: "1876",
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
