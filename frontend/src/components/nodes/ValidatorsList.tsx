import JSBI from "jsbi";
import * as React from "react";
import { useNetworkStats } from "@explorer/frontend/hooks/subscriptions";
import { ValidatorFullData } from "@explorer/common/types/procedures";

import ValidatorRow from "@explorer/frontend/components/nodes/ValidatorRow";
import * as BI from "@explorer/frontend/libraries/bigint";

// The share of "network holders", cumulative amount of validators
// that considered "in control" of the network by holding significant amount of staked tokens
const NETWORK_HOLDER_SHARE_PERCENT = 33;

interface Props {
  validators: ValidatorFullData[];
  totalStake: string;
  selectedPageIndex: number;
}

export const ITEMS_PER_PAGE = 120;

type ValidatorSortFn = (a: ValidatorFullData, b: ValidatorFullData) => number;

const sortByBNComparison = (aValue?: string, bValue?: string) => {
  if (aValue !== undefined && bValue !== undefined) {
    return BI.cmp(JSBI.BigInt(bValue), JSBI.BigInt(aValue));
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

const ValidatorsList: React.FC<Props> = React.memo(
  ({ validators, totalStake, selectedPageIndex }) => {
    const sortedValidators = React.useMemo(
      () =>
        validatorsSortFns.reduceRight(
          (acc, sortFn) => acc.sort(sortFn),
          [...validators]
        ),
      [validators]
    );

    const cumulativeAmounts = React.useMemo<JSBI[]>(
      () =>
        sortedValidators.reduce<JSBI[]>((cumulativeAmounts, validator) => {
          const lastAmount =
            cumulativeAmounts[cumulativeAmounts.length - 1] ?? BI.zero;
          return [
            ...cumulativeAmounts,
            validator.currentEpoch
              ? JSBI.add(lastAmount, JSBI.BigInt(validator.currentEpoch.stake))
              : lastAmount,
          ];
        }, []),
      [sortedValidators]
    );

    const networkHolderIndex = React.useMemo(() => {
      const holderLimit = JSBI.divide(
        JSBI.multiply(
          JSBI.BigInt(totalStake),
          JSBI.BigInt(NETWORK_HOLDER_SHARE_PERCENT)
        ),
        JSBI.BigInt(100)
      );
      return cumulativeAmounts.findIndex((cumulativeAmount) =>
        JSBI.greaterThan(cumulativeAmount, holderLimit)
      );
    }, [totalStake, cumulativeAmounts]);

    const startValidatorIndex = selectedPageIndex * ITEMS_PER_PAGE;

    const { data: networkStats } = useNetworkStats();
    const seatPrice = networkStats?.seatPrice;

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
                totalStake={JSBI.BigInt(totalStake)}
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
