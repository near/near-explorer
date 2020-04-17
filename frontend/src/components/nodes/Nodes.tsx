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
              <Col md="auto" xs="1" className="pr-0">
                <img
                  src={"/static/images/icon-m-node-online.svg"}
                  style={{ width: "12px" }}
                />
              </Col>
              <Col md="auto" className="align-self-center pagination-total">
                {this.state.total
                  ? `${this.state.total.toLocaleString()} VALIDATORS`
                  : ""}
              </Col>
            </Row>
            <style jsx>{`
              div :global(.pagination-total) {
                font-size: 12px;
                font-weight: 500;
                letter-spacing: 1.38px;
                color: #999999;
                text-transform: uppercase;
                margin-bottom: 1.5em;
                padding-top: 5px;
                padding-bottom: 5px;
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
