import { renderElement } from "../../../testing/utils";

import ValidatorRow from "../ValidatorRow";

import {
  getCumulativeStake,
  VALIDATORS_LIST,
  VALIDATORS_TOTAL_STAKE,
} from "./validators";

describe("<ValidatorRow />", () => {
  it("renders simple 'active' Validators row", () => {
    expect(
      renderElement(
        <ValidatorRow
          key={VALIDATORS_LIST[0].account_id}
          node={VALIDATORS_LIST[0]}
          totalStake={VALIDATORS_TOTAL_STAKE}
          cumulativeStake={getCumulativeStake(VALIDATORS_LIST[0])}
          isNetworkHolder={true}
          index={1}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders 'active' Validators row without 'poolDetails'", () => {
    expect(
      renderElement(
        <ValidatorRow
          key={VALIDATORS_LIST[1].account_id}
          node={VALIDATORS_LIST[1]}
          totalStake={VALIDATORS_TOTAL_STAKE}
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
          key={VALIDATORS_LIST[2].account_id}
          node={VALIDATORS_LIST[2]}
          totalStake={VALIDATORS_TOTAL_STAKE}
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
          key={VALIDATORS_LIST[7].account_id}
          node={VALIDATORS_LIST[7]}
          totalStake={VALIDATORS_TOTAL_STAKE}
          cumulativeStake={getCumulativeStake(VALIDATORS_LIST[0])}
          isNetworkHolder={false}
          index={4}
        />
      )
    ).toMatchSnapshot();
  });
});
