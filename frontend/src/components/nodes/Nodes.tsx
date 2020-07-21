import nearApi from "near-api-js";
import React from "react";

import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

import NodeRow from "./NodeRow";
import ValidatorRow from "./ValidatorRow";
import ProposalRow from "./ProposalRow";
import PaginationSpinner from "../utils/PaginationSpinner";

interface Props {
  role: string;
}

interface State {
  onlineNodes?: N.NodeInfo[];
  validators?: N.Validating[];
  proposals?: N.Proposal[];
}
export default class extends React.Component<Props, State> {
  state: State = {};

  getNonValidatingNodes = async () => {
    return await new NodesApi().getOnlineNodes();
  };

  signNewValidators = (newValidators: any) => {
    for (let i = 0; i < newValidators.length; i++) {
      newValidators[i].new = true;
    }
    return newValidators;
  };

  signRemovedValidators = (removedValidators: any) => {
    for (let i = 0; i < removedValidators.length; i++) {
      removedValidators[i].removed = true;
    }
    return removedValidators;
  };

  getNodes = async () => {
    if (this.props.role === "validators") {
      let nodes = await new NodesApi().queryNodeRpc();
      let currentValidators = nodes.current_validators;
      let nextValidators = nodes.next_validators;
      const { newValidators, removedValidators } = nearApi.validators.diffEpochValidators(
        currentValidators,
        nextValidators
      );
      this.signNewValidators(newValidators);
      this.signRemovedValidators(removedValidators);
      currentValidators = currentValidators.concat(newValidators);
      this.setState({ validators: currentValidators });
    }
    if (this.props.role === "online-nodes") {
      let onlineNodes = await this.getNonValidatingNodes();
      this.setState({ onlineNodes });
    }
    if (this.props.role === "proposals") {
      let proposals = (await new NodesApi().queryNodeRpc()).current_proposals;
      this.setState({ proposals });
    }
  };

  componentDidUpdate(prevProps: any) {
    if (this.props.role !== prevProps.role) {
      this.getNodes();
    }
  }

  componentDidMount() {
    this.getNodes();
  }

  render() {
    const { validators, onlineNodes, proposals } = this.state;
    let nodes;
    if (validators && this.props.role === "validators") {
      nodes = validators.map((node: N.Validating) => (
        <ValidatorRow key={node.account_id} node={node} />
      ));
    }
    if (onlineNodes && this.props.role === "online-nodes") {
      nodes = onlineNodes.map((node: N.NodeInfo) => (
        <NodeRow key={node.nodeId} node={node} />
      ));
    }
    if (proposals && this.props.role === "proposals") {
      nodes = proposals.map((node: N.Proposal) => (
        <ProposalRow key={node.account_id} node={node} />
      ));
    }
    if (!nodes) {
      return <PaginationSpinner hidden={false} />;
    }
    return <>{nodes}</>;
  }
}
