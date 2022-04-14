import BN from "bn.js";
import * as React from "react";
import { ValidationNodeInfo } from "../../libraries/wamp/types";

import ValidatorRow from "./ValidatorRow";

const epochValidatorsStake = new Map();

interface Props {
  validators: ValidationNodeInfo[];
  pages: {
    startPage: number;
    endPage: number;
    activePage: number;
    itemsPerPage: number;
  };
}

const getCurrentStake = (node: ValidationNodeInfo): string => {
  return node.currentStake || "0";
};

const ValidatorsList: React.FC<Props> = React.memo(
  ({ validators, pages: { startPage, endPage, activePage, itemsPerPage } }) => {
    let validatorsList = validators.sort((a, b) => {
      // we take "active", "joining", "leaving" validators and sort them firstly
      // after then we sort the rest
      const validatingGroup = ["active", "joining", "leaving"];

      const aInValidatingGroup =
        a.stakingStatus && validatingGroup.indexOf(a.stakingStatus) >= 0;
      const bInValidatingGroup =
        b.stakingStatus && validatingGroup.indexOf(b.stakingStatus) >= 0;

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

    // filter validators list by 'active' and 'leaving' validators to calculate cumulative
    // stake only for those validators
    const activeValidatorsList = validatorsList.filter(
      (i) =>
        i.stakingStatus && ["active", "leaving"].indexOf(i.stakingStatus) >= 0
    );

    const totalStake = activeValidatorsList.reduce(
      (acc, node) => acc.add(new BN(getCurrentStake(node))),
      new BN(0)
    );

    activeValidatorsList.forEach((validator, index) => {
      let total = new BN(0);
      for (let i = 0; i <= index; i++) {
        total = total.add(new BN(getCurrentStake(activeValidatorsList[i])));
        epochValidatorsStake.set(validator.account_id, total);
      }
    });

    validatorsList.forEach((validator, index) => {
      const validatorCumStake = epochValidatorsStake.get(validator.account_id);
      if (validatorCumStake) {
        validatorsList[index].cumulativeStakeAmount = validatorCumStake;
      }
    });

    return (
      <>
        {validatorsList.slice(startPage - 1, endPage).map((node, index) => (
          <ValidatorRow
            key={node.account_id}
            node={node}
            index={activePage * itemsPerPage + index + 1}
            totalStake={totalStake}
          />
        ))}
      </>
    );
  }
);

export default ValidatorsList;
