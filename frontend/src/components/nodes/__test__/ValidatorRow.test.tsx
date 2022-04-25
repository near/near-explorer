import { renderElement } from "../../../testing/utils";

import ValidatorRow from "../ValidatorRow";

import { getCumulativeStake, VALIDATORS_LIST } from "./validators";

const totalStake = getCumulativeStake(
  VALIDATORS_LIST[VALIDATORS_LIST.length - 1]
);

describe("<ValidatorRow />", () => {
  it("renders simple 'active' Validators row", () => {
    expect(
      renderElement(
        <ValidatorRow
          key={VALIDATORS_LIST[0].accountId}
          validator={VALIDATORS_LIST[0]}
          totalStake={totalStake}
          cumulativeStake={getCumulativeStake(VALIDATORS_LIST[0])}
          isNetworkHolder={true}
          index={1}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders 'active' Validators row without 'description'", () => {
    expect(
      renderElement(
        <ValidatorRow
          key={VALIDATORS_LIST[1].accountId}
          validator={VALIDATORS_LIST[1]}
          totalStake={totalStake}
          cumulativeStake={getCumulativeStake(VALIDATORS_LIST[0])}
          isNetworkHolder={false}
          index={2}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders 'active' Validators row with full data", () => {
    expect(
      renderElement(
        <ValidatorRow
          key={VALIDATORS_LIST[2].accountId}
          validator={VALIDATORS_LIST[2]}
          totalStake={totalStake}
          cumulativeStake={getCumulativeStake(VALIDATORS_LIST[0])}
          isNetworkHolder={false}
          index={3}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders 'idle' Validators row with minimum data", () => {
    expect(
      renderElement(
        <ValidatorRow
          key={VALIDATORS_LIST[7].accountId}
          validator={VALIDATORS_LIST[7]}
          totalStake={totalStake}
          cumulativeStake={getCumulativeStake(VALIDATORS_LIST[0])}
          isNetworkHolder={false}
          index={4}
        />
      )
    ).toMatchSnapshot();
  });
});
