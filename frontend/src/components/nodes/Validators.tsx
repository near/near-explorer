import * as nearApi from "near-api-js";
import React from "react";

import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

import ValidatorRow from "./ValidatorRow";
import PaginationSpinner from "../utils/PaginationSpinner";

interface State {
  validators?: N.Validating[];
}
export default class extends React.Component<State> {
  state: State = {};

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
    let nodes = await new NodesApi().queryNodeRpc();
    let currentValidators = nodes.current_validators;
    let nextValidators = nodes.next_validators;
    const {
      newValidators,
      removedValidators,
    } = nearApi.validators.diffEpochValidators(
      currentValidators,
      nextValidators
    );
    this.signNewValidators(newValidators);
    this.signRemovedValidators(removedValidators);
    currentValidators = currentValidators.concat(newValidators);
    this.setState({ validators: currentValidators });
  };

  componentDidMount() {
    this.getNodes();
  }

  render() {
    const { validators } = this.state;
    if (!validators) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <>
        {validators.map((node: N.Proposal) => (
          <ValidatorRow key={node.account_id} node={node} />
        ))}
      </>
    );
  }
}
