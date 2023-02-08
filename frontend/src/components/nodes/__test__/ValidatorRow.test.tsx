import JSBI from "jsbi";
import { renderElement } from "@explorer/frontend/testing/utils";

import ValidatorRow from "@explorer/frontend/components/nodes/ValidatorRow";

import { getCumulativeStake, VALIDATORS_LIST } from "./validators";
import * as BI from "@explorer/frontend/libraries/bigint";

const totalStake = getCumulativeStake(
  VALIDATORS_LIST[VALIDATORS_LIST.length - 1]
);

const seatPrice = VALIDATORS_LIST.map(
  (validator) => validator.currentEpoch?.stake
)
  .filter((x): x is string => Boolean(x))
  .sort((a, b) => BI.cmp(JSBI.BigInt(a), JSBI.BigInt(b)))[0];

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
          seatPrice={seatPrice}
          index={0}
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
          seatPrice={seatPrice}
          index={1}
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
          seatPrice={seatPrice}
          index={2}
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
          seatPrice={seatPrice}
          index={3}
        />
      )
    ).toMatchSnapshot();
  });
});
