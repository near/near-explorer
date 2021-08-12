import { renderI18nElement } from "../../../libraries/tester";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

import AccountDetails from "../AccountDetails";

describe("<AccountDetails />", () => {
  beforeEach(() => jest.resetAllMocks());

  it("should load income and outcome transactions count", async () => {
    const wrapper = shallow(
      <AccountDetails
        account={{
          accountId: "megan.near",
          createdAtBlockTimestamp: Number(new Date(2019, 1, 1)),
          createdByTransactionHash: "Genesis",
          deletedAtBlockTimestamp: null,
          deletedByTransactionHash: null,
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
    );

    const outTransactionsCount = 19;
    const inTransactionsCount = 11;

    wrapper.instance().state.outTransactionsCount = outTransactionsCount;
    wrapper.instance().state.inTransactionsCount = inTransactionsCount;
    wrapper.update();

    expect(wrapper.instance().state).toBeDefined();
  });

  it("renders with account created at genesis (legacy)", () => {
    expect(
      renderI18nElement(
        <AccountDetails
          account={{
            accountId: "megan.near",
            createdAtBlockTimestamp: Number(new Date(2019, 1, 1)),
            createdByTransactionHash: "Genesis",
            deletedAtBlockTimestamp: null,
            deletedByTransactionHash: null,
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

  it("renders with account created at genesis", () => {
    expect(
      renderI18nElement(
        <AccountDetails
          account={{
            accountId: "megan.near",
            createdAtBlockTimestamp: null,
            createdByTransactionHash: null,
            deletedAtBlockTimestamp: null,
            deletedByTransactionHash: null,
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

  it("renders with account deletion at", () => {
    expect(
      renderI18nElement(
        <AccountDetails
          account={{
            accountId: "megan.near",
            createdAtBlockTimestamp: null,
            createdByTransactionHash: null,
            deletedAtBlockTimestamp: Number(new Date(2019, 1, 2)),
            deletedByTransactionHash:
              "3RAqiv3SzjmtMT3ncqU96q1efRm67YT6gxtS7hhPvADp",
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

  it("renders with lockup account", () => {
    expect(
      renderI18nElement(
        <AccountDetails
          account={{
            accountId: "megan.near",
            createdAtBlockTimestamp: Number(new Date(2019, 1, 1)),
            createdByTransactionHash:
              "EVvWW1S9BFaEjY1JBNSdstb7ZTtTFjQ6cygkbw1KY4tL",
            deletedAtBlockTimestamp: null,
            deletedByTransactionHash: null,
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
      renderI18nElement(
        <AccountDetails
          account={{
            accountId: "near.near",
            createdAtBlockTimestamp: Number(new Date(2019, 1, 1)),
            createdByTransactionHash:
              "EVvWW1S9BFlkjkmnjmkb7ZTtTFjQ6cygkbw1KY4tL",
            deletedAtBlockTimestamp: null,
            deletedByTransactionHash: null,
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
