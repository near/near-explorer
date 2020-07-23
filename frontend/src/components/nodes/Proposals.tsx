import React from "react";

import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

import ProposalRow from "./ProposalRow";
import PaginationSpinner from "../utils/PaginationSpinner";

interface State {
  proposals?: N.Proposal[];
}

export default class extends React.Component<State> {
  state: State = {};

  getNodes = async () => {
    let proposals = (await new NodesApi().queryNodeRpc()).current_proposals;
    this.setState({ proposals });
  };

  componentDidMount() {
    this.getNodes();
  }

  render() {
    const { proposals } = this.state;
    if (!proposals) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <>
        {proposals.map((node: N.Proposal) => (
          <ProposalRow key={node.account_id} node={node} />
        ))}
      </>
    );
  }
}
