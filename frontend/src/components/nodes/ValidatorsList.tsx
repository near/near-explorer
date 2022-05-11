import BN from "bn.js";
import * as React from "react";
import { useNetworkStats } from "../../hooks/subscriptions";
import { ValidatorFullData } from "../../types/common";

import ValidatorRow from "./ValidatorRow";

// The share of "network holders", cumulative amount of validators
// that considered "in control" of the network by holding significant amount of staked tokens
const NETWORK_HOLDER_SHARE = 0.33;

interface Props {
  validators: ValidatorFullData[];
  totalStake: string;
  selectedPageIndex: number;
}

export const ITEMS_PER_PAGE = 120;

type ValidatorSortFn = (a: ValidatorFullData, b: ValidatorFullData) => number;

const sortByBNComparison = (aValue?: string, bValue?: string) => {
  if (aValue !== undefined && bValue !== undefined) {
    return new BN(bValue).cmp(new BN(aValue));
  } else if (aValue) {
    return -1;
  } else if (bValue) {
    return 1;
  } else {
    return 0;
  }
};

const validatorsSortFns: ValidatorSortFn[] = [
  (a, b) => sortByBNComparison(a.currentEpoch?.stake, b.currentEpoch?.stake),
  (a, b) => sortByBNComparison(a.nextEpoch?.stake, b.nextEpoch?.stake),
  (a, b) =>
    sortByBNComparison(a.afterNextEpoch?.stake, b.afterNextEpoch?.stake),
  (a, b) => sortByBNComparison(a.contractStake, b.contractStake),
];

const ZERO = new BN(0);

const ValidatorsList: React.FC<Props> = React.memo(
  ({ validators, totalStake, selectedPageIndex }) => {
    const sortedValidators = React.useMemo(
      () =>
        validatorsSortFns.reduceRight((acc, sortFn) => acc.sort(sortFn), [
          ...validators,
        ]),
      [validators]
    );

    const cumulativeAmounts = React.useMemo<BN[]>(
      () =>
        sortedValidators.reduce<BN[]>((cumulativeAmounts, validator) => {
          const lastAmount =
            cumulativeAmounts[cumulativeAmounts.length - 1] ?? ZERO;
          return [
            ...cumulativeAmounts,
            validator.currentEpoch
              ? lastAmount.add(new BN(validator.currentEpoch.stake))
              : lastAmount,
          ];
        }, []),
      [sortedValidators]
    );

    const networkHolderIndex = React.useMemo(() => {
      const holderLimit = new BN(totalStake).muln(NETWORK_HOLDER_SHARE);
      return cumulativeAmounts.findIndex((cumulativeAmount) =>
        cumulativeAmount.gt(holderLimit)
      );
    }, [totalStake, cumulativeAmounts]);

    const startValidatorIndex = selectedPageIndex * ITEMS_PER_PAGE;

    const seatPrice = useNetworkStats()?.seatPrice;

    return (
      <>
        {sortedValidators
          .slice(startValidatorIndex, startValidatorIndex + ITEMS_PER_PAGE)
          .map((validator, index) => {
            const pagedIndex = startValidatorIndex + index;
            return (
              <ValidatorRow
                key={validator.accountId}
                validator={validator}
                index={pagedIndex}
                totalStake={new BN(totalStake)}
                cumulativeStake={cumulativeAmounts[pagedIndex]}
                isNetworkHolder={networkHolderIndex === pagedIndex}
                seatPrice={seatPrice}
              />
            );
          })}
      </>
    );
  }
);

export default ValidatorsList;
