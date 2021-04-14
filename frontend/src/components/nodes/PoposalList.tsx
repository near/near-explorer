import BN from "bn.js";
import React from "react";

import * as N from "../../libraries/explorer-wamp/nodes";

import ProposalRow from "./ProposalRow";

interface Props {
  proposals: any;
  pages: any;
}

class ProposalList extends React.PureComponent<Props> {
  calculateStake = (nodeIndex: number) => {
    let total = new BN(0);
    for (let i = 0; i <= nodeIndex; i++) {
      total = total.add(new BN(this.props.proposals[i].stake));
    }
    return total;
  };

  render() {
    const {
      proposals,
      pages: { startPage, endPage, activePage, itemsPerPage },
    } = this.props;
    const totalStake = proposals.reduce(
      (acc: BN, node: any) => acc.add(new BN(node.stake)),
      new BN(0)
    );
    return (
      <>
        {proposals
          .sort((a: N.Proposal, b: N.Proposal) =>
            new BN(b.stake).sub(new BN(a.stake))
          )
          .slice(startPage - 1, endPage)
          .map((node: N.Proposal, index: number) => (
            <ProposalRow
              key={node.account_id}
              node={node}
              index={activePage * itemsPerPage + index + 1}
              totalStake={totalStake}
              cumulativeStakeAmount={this.calculateStake(
                activePage * itemsPerPage + index
              )}
            />
          ))}
      </>
    );
  }
}

export default ProposalList;
