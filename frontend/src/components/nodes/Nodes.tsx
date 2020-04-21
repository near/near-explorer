import React from "react";
import { Row, Col } from "react-bootstrap";

import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import FlipMove from "../utils/FlipMove";

import NodeRow from "./NodeRow";

import { OuterProps } from "../accounts/Accounts";

export default class extends React.Component<OuterProps> {
  static defaultProps = {
    count: 15
  };

  fetchNodes = async (count: number, endTimestamp?: number) => {
    return await new NodesApi().getNodes(count, endTimestamp);
  };

  config = {
    fetchDataFn: this.fetchNodes,
    count: this.props.count,
    category: "Node"
  };

  autoRefreshNodes = autoRefreshHandler(Nodes, this.config);

  render() {
    return <this.autoRefreshNodes />;
  }
}

interface InnerProps {
  items: N.NodeInfo[];
}

interface State {
  total?: number;
}

class Nodes extends React.Component<InnerProps, State> {
  state: State = {};

  getTotal = async () => {
    new NodesApi().getTotalValidators().then(total => this.setState({ total }));
  };

  componentDidMount() {
    this.getTotal();
  }

  render() {
    const { items } = this.props;
    return (
      <>
        {items && (
          <div>
            <Row>
              <Col
                md="3"
                xs="12"
                className="node-selector pagination-total align-self-center"
              >
                <img
                  src={"/static/images/icon-m-node-online.svg"}
                  style={{ width: "12px", marginRight: "10px" }}
                />
                {this.state.total
                  ? `   ${this.state.total.toLocaleString()} VALIDATORS`
                  : `   0 VALIDATORS`}
              </Col>
              <Col
                md="3"
                xs="12"
                className="node-selector pagination-total align-self-center"
              >
                <img
                  src={"/static/images/icon-m-node-online-gray.svg"}
                  style={{ width: "12px", marginRight: "10px" }}
                />
                ALL NODES
              </Col>
            </Row>
            <style jsx global>{`
              .pagination-total {
                font-size: 12px;
                font-weight: 500;
                letter-spacing: 1.38px;
                color: #24272a;
                text-transform: uppercase;
                margin-bottom: 1.5em;
                padding: 8px;
              }

              .node-selector {
                text-align: center;
                background: #fff;
                border: 2px solid #e6e6e6;
                box-sizing: border-box;
                border-radius: 25px;
                margin-left: 15px;
              }
            `}</style>
          </div>
        )}
        <FlipMove duration={1000} staggerDurationBy={0}>
          {items &&
            items.map(node => {
              return <NodeRow key={node.nodeId} node={node} />;
            })}
        </FlipMove>
      </>
    );
  }
}
