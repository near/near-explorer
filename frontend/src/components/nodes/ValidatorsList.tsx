import BN from "bn.js";
import { FC } from "react";

import * as N from "../../libraries/explorer-wamp/nodes";

import ValidatorRow from "./ValidatorRow";

const epochValidatorsStake = new Map();

interface Props {
  validators: N.ValidationNodeInfo[];
  pages: {
    startPage: number;
    endPage: number;
    activePage: number;
    itemsPerPage: number;
  };
}

const ValidatorsList: FC<Props> = ({
  validators,
  pages: { startPage, endPage, activePage, itemsPerPage },
}) => {
  let validatorsList = validators.sort(
    (a: N.ValidationNodeInfo, b: N.ValidationNodeInfo) => {
      // we take "active", "joining", "leaving" validators and sort them firstly
      // after then we sort the rest
      const validatingGroup = ["active", "joining", "leaving"];

      const aInValidatingGroup =
        a.stakingStatus && validatingGroup.indexOf(a.stakingStatus) >= 0;
      const bInValidatingGroup =
        b.stakingStatus && validatingGroup.indexOf(b.stakingStatus) >= 0;

      if (aInValidatingGroup && bInValidatingGroup) {
        return new BN(b.currentStake).cmp(new BN(a.currentStake));
      } else if (aInValidatingGroup) {
        return -1;
      } else if (bInValidatingGroup) {
        return 1;
      } else {
        const aStake = BN.max(
          new BN(b.proposedStake || 0),
          new BN(b.currentStake || 0)
        );
        const bStake = BN.max(
          new BN(a.proposedStake || 0),
          new BN(a.currentStake || 0)
        );
        return aStake.cmp(bStake);
      }
    }
  );

  // filter validators list by 'active' and 'leaving' validators to calculate cumulative
  // stake only for those validators
  const activeValidatorsList = validatorsList.filter(
    (i: N.ValidationNodeInfo) =>
      i.stakingStatus && ["active", "leaving"].indexOf(i.stakingStatus) >= 0
  );

  const totalStake = activeValidatorsList.reduce(
    (acc: BN, node: N.ValidationNodeInfo) => acc.add(new BN(node.currentStake)),
    new BN(0)
  ) as BN;

  activeValidatorsList.forEach(
    (validator: N.ValidationNodeInfo, index: number) => {
      let total = new BN(0);
      for (let i = 0; i <= index; i++) {
        total = total.add(new BN(activeValidatorsList[i].currentStake));
        epochValidatorsStake.set(validator.account_id, total);
      }
    }
  );

  validatorsList.forEach((validator: N.ValidationNodeInfo, index: number) => {
    const validatorCumStake = epochValidatorsStake.get(validator.account_id);
    if (validatorCumStake) {
      validatorsList[index].cumulativeStakeAmount = validatorCumStake;
    }
  });

  return (
    <>
      {validatorsList
        .slice(startPage - 1, endPage)
        .map((node: N.ValidationNodeInfo, index: number) => (
          <ValidatorRow
            key={node.account_id}
            node={node}
            index={activePage * itemsPerPage + index + 1}
            totalStake={totalStake}
          />
        ))}
    </>
  );
};

export default ValidatorsList;
