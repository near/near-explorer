import React from "react";
import { Row, Col } from "react-bootstrap";

import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import FlipMove from "../utils/FlipMove";
import PaginationSpinner from "../utils/PaginationSpinner";
import NodeRow from "./NodeRow";

import { OuterProps } from "../accounts/Accounts";

export default class extends React.Component<OuterProps> {
  static defaultProps = {
    count: 15,
  };

  fetchNodes = async () => {
    return await new NodesApi().getNodes(this.props.count);
  };

  autoRefreshNodes = autoRefreshHandler(Nodes, this.fetchNodes);
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
    if (items.length === 0) {
      return <PaginationSpinner hidden={false} />;
    }
    return (
      <>
        {items && (
          <div>
            <Row>
              <Col md="auto" className="align-self-center pagination-total">
                {`${items.length.toLocaleString()} Total`}
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
            items.map((node) => {
              return (
                <NodeRow
                  key={node.nodeId}
                  ipAddress={node.ipAddress}
                  moniker={node.moniker}
                  accountId={node.accountId}
                  nodeId={node.nodeId}
                  lastSeen={node.lastSeen}
                  lastHeight={node.lastHeight}
                  isValidator={node.isValidator}
                  agentName={node.agentName}
                  agentVersion={node.agentVersion}
                  agentBuild={node.agentBuild}
                />
              );
            })}
        </FlipMove>
      </>
    );
  }
}
