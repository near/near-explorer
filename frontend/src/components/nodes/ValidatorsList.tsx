import BN from "bn.js";
import * as React from "react";
import { ValidationNodeInfo } from "../../libraries/wamp/types";

import ValidatorRow from "./ValidatorRow";

// The share of "network holders", cumulative amount of validators
// that considered "in control" of the network by holding significant amount of staked tokens
const NETWORK_HOLDER_SHARE = 0.33;

interface Props {
  validators: ValidationNodeInfo[];
  selectedPageIndex: number;
}

export const ITEMS_PER_PAGE = 120;

const getCurrentStake = (node: ValidationNodeInfo): string => {
  return node.currentStake || "0";
};

const sortValidators = (nodes: ValidationNodeInfo[]): ValidationNodeInfo[] => {
  return [...nodes].sort((a, b) => {
    // we take "active", "joining", "leaving" validators and sort them firstly
    // after then we sort the rest
    const validatingGroup = ["active", "joining", "leaving"];

    const aInValidatingGroup =
      a.stakingStatus && validatingGroup.includes(a.stakingStatus);
    const bInValidatingGroup =
      b.stakingStatus && validatingGroup.includes(b.stakingStatus);

    const aCurrentStake = getCurrentStake(a);
    const bCurrentStake = getCurrentStake(b);
    if (aInValidatingGroup && bInValidatingGroup) {
      return new BN(bCurrentStake).cmp(new BN(aCurrentStake));
    } else if (aInValidatingGroup) {
      return -1;
    } else if (bInValidatingGroup) {
      return 1;
    } else {
      const aStake = BN.max(
        new BN(b.proposedStake || 0),
        new BN(bCurrentStake)
      );
      const bStake = BN.max(
        new BN(a.proposedStake || 0),
        new BN(aCurrentStake)
      );
      return aStake.cmp(bStake);
    }
  });
};

const ValidatorsList: React.FC<Props> = React.memo(
  ({ validators, selectedPageIndex }) => {
    const sortedValidators = React.useMemo(() => sortValidators(validators), [
      validators,
    ]);

    const {
      cumulativeAmounts,
      totalStake,
      networkHolderIndex,
    } = React.useMemo<{
      totalStake: BN;
      cumulativeAmounts: BN[];
      networkHolderIndex: number;
    }>(() => {
      const { cumulativeAmounts, totalStake } = sortedValidators.reduce<{
        totalStake: BN;
        cumulativeAmounts: BN[];
      }>(
        (acc, validator) => {
          const prevAmounts = acc.cumulativeAmounts;
          // filter validators list by 'active' and 'leaving' validators to calculate cumulative
          // stake only for those validators
          if (
            !validator.stakingStatus ||
            !["active", "leaving"].includes(validator.stakingStatus)
          ) {
            return {
              totalStake: acc.totalStake,
              cumulativeAmounts: [
                ...prevAmounts,
                prevAmounts[prevAmounts.length - 1],
              ],
            };
          }
          const nextTotal = acc.totalStake.add(
            new BN(getCurrentStake(validator))
          );
          return {
            totalStake: nextTotal,
            cumulativeAmounts: [...prevAmounts, nextTotal],
          };
        },
        {
          totalStake: new BN(0),
          cumulativeAmounts: [],
        }
      );
      const holderLimit = totalStake.muln(NETWORK_HOLDER_SHARE);
      const networkHolderIndex = cumulativeAmounts.findIndex(
        (cumulativeAmount) => cumulativeAmount.gt(holderLimit)
      );
      return {
        cumulativeAmounts,
        totalStake,
        networkHolderIndex,
      };
    }, [sortedValidators]);

    const startValidatorIndex = selectedPageIndex * ITEMS_PER_PAGE;

    return (
      <>
        {sortedValidators
          .slice(startValidatorIndex, startValidatorIndex + ITEMS_PER_PAGE)
          .map((node, index) => {
            const pagedIndex = startValidatorIndex + index;
            return (
              <ValidatorRow
                key={node.account_id}
                node={node}
                index={pagedIndex + 1}
                totalStake={totalStake}
                cumulativeStake={cumulativeAmounts[pagedIndex]}
                isNetworkHolder={networkHolderIndex === pagedIndex}
              />
            );
          })}
      </>
    );
  }
);

export default ValidatorsList;
