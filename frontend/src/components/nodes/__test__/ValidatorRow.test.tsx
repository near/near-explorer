import * as React from "react";

import JSBI from "jsbi";

import { ValidatorFullData } from "@/common/types/procedures";
import { ValidatorRow } from "@/frontend/components/nodes/ValidatorRow";
import * as BI from "@/frontend/libraries/bigint";
import { renderElement } from "@/frontend/testing/utils";

import { VALIDATORS_LIST } from "./validators";

const getCumulativeStake = (node: ValidatorFullData): JSBI => {
  let cumulativeStake = BI.zero;
  for (const validator of VALIDATORS_LIST) {
    cumulativeStake = JSBI.add(
      cumulativeStake,
      JSBI.BigInt(validator.currentEpoch?.stake || "0")
    );
    if (validator === node) {
      return cumulativeStake;
    }
  }
  return cumulativeStake;
};

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
          isNetworkHolder
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
