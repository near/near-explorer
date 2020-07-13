import React from "react";

import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

import NodeRow from "./NodeRow";
import ValidatorRow from "./ValidatorRow";
import PaginationSpinner from "../utils/PaginationSpinner";

interface Props {
  role: string;
}

interface State {
  onlineNodes?: N.NodeInfo[];
  validators?: any;
}
export default class extends React.Component<Props, State> {
  state: State = {};

  getNonValidatingNodes = async () => {
    return await new NodesApi().getOnlineNodes();
  };

  getNodes = async () => {
    if (this.props.role === "validators") {
      let validators = await new NodesApi().queryValidators();
      this.setState({ validators });
    }
    if (this.props.role === "online-nodes") {
      let onlineNodes = await this.getNonValidatingNodes();
      this.setState({ onlineNodes });
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
    const { validators, onlineNodes } = this.state;
    let nodes;
    if (validators && this.props.role === "validators") {
      nodes = validators.map((node: any) => (
        <ValidatorRow key={node.account_id} node={node} />
      ));
    }
    if (onlineNodes && this.props.role === "online-nodes") {
      nodes = onlineNodes.map((node: N.NodeInfo) => (
        <NodeRow key={node.nodeId} node={node} />
      ));
    }
    if (!nodes) {
      return <PaginationSpinner hidden={false} />;
    }
    return <>{nodes}</>;
  }
}
