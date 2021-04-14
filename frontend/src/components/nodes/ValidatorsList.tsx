import BN from "bn.js";
import React from "react";

import * as N from "../../libraries/explorer-wamp/nodes";

import ValidatorRow from "./ValidatorRow";

interface Props {
  validators: any;
  pages: any;
}

class ValidatorsList extends React.PureComponent<Props> {
  calculateStake = (nodeIndex: number, totalStake: BN) => {
    let total = new BN(0);
    let networkHolderIndex = [];
    for (let i = 0; i <= nodeIndex; i++) {
      total = total.add(new BN(this.props.validators[i].stake));

      if (total.gt(totalStake.div(new BN(3)))) {
        networkHolderIndex.push(i);
      }
    }
    return { total, networkHolderIndex: networkHolderIndex[0] };
  };

  render() {
    const {
      validators,
      pages: { startPage, endPage, activePage, itemsPerPage },
    } = this.props;
    const totalStake = validators.reduce(
      (acc: BN, node: any) => acc.add(new BN(node.stake)),
      new BN(0)
    );

    return (
      <>
        {validators
          .sort((a: N.Validating, b: N.Validating) =>
            new BN(b.stake).sub(new BN(a.stake))
          )
          .slice(startPage - 1, endPage)
          .map((node: N.Validating, index: number) => (
            <ValidatorRow
              key={node.account_id}
              node={node}
              index={activePage * itemsPerPage + index + 1}
              totalStake={totalStake}
              cumulativeStakeAmount={this.calculateStake(
                activePage * itemsPerPage + index,
                totalStake
              )}
            />
          ))}
      </>
    );
  }
}

export default ValidatorsList;
