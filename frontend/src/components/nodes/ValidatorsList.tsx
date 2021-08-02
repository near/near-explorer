import BN from "bn.js";
import React from "react";

import * as N from "../../libraries/explorer-wamp/nodes";

import ValidatorRow from "./ValidatorRow";

const epochValidatorsStake = new Map();

interface Props {
  validators: any;
  pages: any;
  cellCount: number;
}

class ValidatorsList extends React.PureComponent<Props> {
  render() {
    const {
      validators,
      pages: { startPage, endPage, activePage, itemsPerPage },
      cellCount,
    } = this.props;

    let validatorsList = validators.sort(
      (a: N.ValidationNodeInfo, b: N.ValidationNodeInfo) => {
        return new BN(b.stake).sub(new BN(a.stake));
      }
    );

    // filter validators list by 'active' and 'leaving' validators to culculate cumulative
    // stake only for those validators
    const activeValidatorsList = validatorsList.filter(
      (i: N.ValidationNodeInfo) =>
        i.validatorStatus &&
        ["active", "leaving"].indexOf(i.validatorStatus) >= 0
    );

    const totalStake = activeValidatorsList.reduce(
      (acc: BN, node: N.ValidationNodeInfo) => acc.add(new BN(node.stake)),
      new BN(0)
    );

    activeValidatorsList.forEach(
      (validator: N.ValidationNodeInfo, index: number) => {
        let total = new BN(0);
        for (let i = 0; i <= index; i++) {
          total = total.add(new BN(activeValidatorsList[i].stake));
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

    validatorsList.some((validator: N.ValidationNodeInfo, index: number) =>
      totalStake &&
      validator.cumulativeStakeAmount &&
      validator.cumulativeStakeAmount.gt(totalStake.divn(3))
        ? (validatorsList[index].networkHolder = true)
        : false
    );

    console.log("Update");
    return (
      <>
        {validatorsList
          .slice(startPage - 1, endPage)
          .map((node: N.ValidationNodeInfo, index: number) => (
            <ValidatorRow
              key={node.account_id}
              node={node}
              index={activePage * itemsPerPage + index + 1}
              cellCount={cellCount}
              totalStake={totalStake}
            />
          ))}
      </>
    );
  }
}

export default ValidatorsList;
