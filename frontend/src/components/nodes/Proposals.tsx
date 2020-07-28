import React from "react";

import * as N from "../../libraries/explorer-wamp/nodes";
import { SubscriptionConsumer } from "../../context/SubscriptionProvider";

import ProposalRow from "./ProposalRow";
import PaginationSpinner from "../utils/PaginationSpinner";

export default class extends React.Component {
  render() {
    return (
      <SubscriptionConsumer>
        {(context) => (
          <>
            {context.nodeInfo.proposals ? (
              context.nodeInfo.proposals.map((node: N.Proposal) => (
                <ProposalRow key={node.account_id} node={node} />
              ))
            ) : (
              <PaginationSpinner hidden={false} />
            )}
          </>
        )}
      </SubscriptionConsumer>
    );
  }
}
