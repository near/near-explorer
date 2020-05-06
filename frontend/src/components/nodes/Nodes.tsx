import React from "react";

import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import FlipMove from "../utils/FlipMove";

import NodeRow from "./NodeRow";

import { OuterProps } from "../accounts/Accounts";

interface Props extends OuterProps {
  role: string;
}
export default class extends React.Component<Props> {
  static defaultProps = {
    count: 15,
  };

  fetchNodes = async (count: number, endTimestamp?: string) => {
    return await new NodesApi().getNodes(count, this.props.role, endTimestamp);
  };

  componentDidUpdate(prevProps: any) {
    if (this.props.role !== prevProps.role) {
      this.autoRefreshNodes = autoRefreshHandler(Nodes, this.config);
    }
  }

  config = {
    fetchDataFn: this.fetchNodes,
    count: this.props.count,
    category: "Node",
  };

  autoRefreshNodes = autoRefreshHandler(Nodes, this.config);

  render() {
    return <this.autoRefreshNodes />;
  }
}

interface InnerProps {
  items: N.NodeInfo[];
}

class Nodes extends React.Component<InnerProps> {
  render() {
    const { items } = this.props;
    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        {items &&
          items.map((node) => <NodeRow key={node.nodeId} node={node} />)}
      </FlipMove>
    );
  }
}
