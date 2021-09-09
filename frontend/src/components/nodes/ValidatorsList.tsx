import BN from "bn.js";
import { Component } from "react";

import * as N from "../../libraries/explorer-wamp/nodes";

import ValidatorRow from "./ValidatorRow";

const epochValidatorsStake = new Map();

interface Props {
  validators: any;
  pages: any;
}

class ValidatorsList extends Component<Props> {
  render() {
    const {
      validators,
      pages: { startPage, endPage, activePage, itemsPerPage },
    } = this.props;

    let validatorsList = validators.sort(
      (a: N.ValidationNodeInfo, b: N.ValidationNodeInfo) => {
        // we take "active", "joining", "leaving" validators and sort them firstly
        // after then we sort the rest
        const validatingGroup = ["active", "joining", "leaving"];
        if (
          a.stakingStatus &&
          validatingGroup.indexOf(a.stakingStatus) >= 0 &&
          b.stakingStatus &&
          validatingGroup.indexOf(b.stakingStatus) >= 0
        ) {
          return new BN(b.currentStake).cmp(new BN(a.currentStake));
        } else if (
          (a.proposedStake || b.proposedStake) &&
          a.stakingStatus &&
          validatingGroup.indexOf(a.stakingStatus) < 0 &&
          b.stakingStatus &&
          validatingGroup.indexOf(b.stakingStatus) < 0
        ) {
          return new BN(b.proposedStake || 0).cmp(new BN(a.proposedStake || 0));
        } else if (
          a.stakingStatus &&
          validatingGroup.indexOf(a.stakingStatus) < 0 &&
          b.stakingStatus &&
          validatingGroup.indexOf(b.stakingStatus) < 0
        ) {
          return new BN(b.currentStake).cmp(new BN(a.currentStake));
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
      (acc: BN, node: N.ValidationNodeInfo) =>
        acc.add(new BN(node.currentStake)),
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
  }
}

export default ValidatorsList;
