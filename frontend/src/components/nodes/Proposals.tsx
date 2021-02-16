import React from "react";

import * as N from "../../libraries/explorer-wamp/nodes";
import { NodeConsumer } from "../../context/NodeProvider";

import ProposalRow from "./ProposalRow";
import PaginationSpinner from "../utils/PaginationSpinner";

export default class extends React.Component {
  render() {
    return (
      <NodeConsumer>
        {(context) => (
          <>
            {context.proposals ? (
              context.proposals.map((node: N.Proposal) => (
                <ProposalRow key={node.accountId} node={node} />
              ))
            ) : (
              <PaginationSpinner hidden={false} />
            )}
          </>
        )}
      </NodeConsumer>
    );
  }
}
