import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import BN from "bn.js";

import AccountRow from "../AccountRow";

describe("<AccountRow />", () => {
  beforeEach(() => jest.resetAllMocks());

  it("should load amount", async () => {
    const wrapper = shallow(
      <AccountRow
        accountId="account"
        createdAt={Number(new Date(2019, 1, 1))}
      />
    );

    const amount = new BN("100000000000000000000000000").add(
      new BN("1000000000000000000000000")
    );

    wrapper.instance().state.amount = amount.toString();
    wrapper.update();

    expect(wrapper.instance().state.amount).toEqual(
      "101000000000000000000000000"
    );
  });

  it("renders with short name", () => {
    expect(
      renderer.create(
        <AccountRow
          accountId="account"
          createdAt={Number(new Date(2019, 1, 1))}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders with long name", () => {
    expect(
      renderer.create(
        <AccountRow
          accountId="b7df2090560a225dc4934aed43db03a6c674c2d4.lockup.near"
          createdAt={Number(new Date(2019, 1, 1))}
        />
      )
    ).toMatchSnapshot();
  });
});
