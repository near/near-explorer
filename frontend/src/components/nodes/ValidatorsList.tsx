import * as React from "react";

import JSBI from "jsbi";

import { ValidatorFullData } from "@/common/types/procedures";
import { notNullishGuard } from "@/common/utils/utils";
import ValidatorRow from "@/frontend/components/nodes/ValidatorRow";
import { useSubscription } from "@/frontend/hooks/use-subscription";
import * as BI from "@/frontend/libraries/bigint";

// The share of "network holders", cumulative amount of validators
// that considered "in control" of the network by holding significant amount of staked tokens
const NETWORK_HOLDER_SHARE_PERCENT = 33;

interface Props {
  validators: ValidatorFullData[];
  selectedPageIndex: number;
}

export const ITEMS_PER_PAGE = 120;

type ValidatorSortFn = (a: ValidatorFullData, b: ValidatorFullData) => number;

const sortByBNComparison = (aValue?: string, bValue?: string) => {
  if (aValue !== undefined && bValue !== undefined) {
    return BI.cmp(JSBI.BigInt(bValue), JSBI.BigInt(aValue));
  }
  if (aValue) {
    return -1;
  }
  if (bValue) {
    return 1;
  }
  return 0;
};

const validatorsSortFns: ValidatorSortFn[] = [
  (a, b) => sortByBNComparison(a.currentEpoch?.stake, b.currentEpoch?.stake),
  (a, b) => sortByBNComparison(a.nextEpoch?.stake, b.nextEpoch?.stake),
  (a, b) =>
    sortByBNComparison(a.afterNextEpoch?.stake, b.afterNextEpoch?.stake),
  (a, b) => sortByBNComparison(a.contractStake, b.contractStake),
];

export const getTotalStake = (validators: ValidatorFullData[]) =>
  validators
    .map((validator) => validator.currentEpoch?.stake)
    .filter(notNullishGuard)
    .reduce((acc, stake) => JSBI.add(acc, JSBI.BigInt(stake)), JSBI.BigInt(0));

const ValidatorsList: React.FC<Props> = React.memo(
  ({ validators, selectedPageIndex }) => {
    const totalStake = React.useMemo(
      () => getTotalStake(validators),
      [validators]
    );
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
        sortedValidators.reduce<JSBI[]>((acc, validator) => {
          const lastAmount = acc[acc.length - 1] ?? BI.zero;
          return [
            ...acc,
            validator.currentEpoch
              ? JSBI.add(lastAmount, JSBI.BigInt(validator.currentEpoch.stake))
              : lastAmount,
          ];
        }, []),
      [sortedValidators]
    );

    const networkHolderIndex = React.useMemo(() => {
      const holderLimit = JSBI.divide(
        JSBI.multiply(totalStake, JSBI.BigInt(NETWORK_HOLDER_SHARE_PERCENT)),
        JSBI.BigInt(100)
      );
      return cumulativeAmounts.findIndex((cumulativeAmount) =>
        JSBI.greaterThan(cumulativeAmount, holderLimit)
      );
    }, [totalStake, cumulativeAmounts]);

    const startValidatorIndex = selectedPageIndex * ITEMS_PER_PAGE;

    const epochStatsSub = useSubscription(["epochStats"]);

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
                totalStake={totalStake}
                cumulativeStake={cumulativeAmounts[pagedIndex]}
                isNetworkHolder={networkHolderIndex === pagedIndex}
                seatPrice={epochStatsSub.data?.seatPrice}
              />
            );
          })}
      </>
    );
  }
);

export default ValidatorsList;
