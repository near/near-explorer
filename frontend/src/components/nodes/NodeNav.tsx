import Link from "next/link";

import React from "react";
import { Row, Col } from "react-bootstrap";

import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

interface Props {
  role: string;
}
interface State {
  nodeStats?: N.NodeStats;
}

export default class extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.timer = null;
  }

  timer: ReturnType<typeof setTimeout> | null;
  state: State = {};

  componentDidMount() {
    this.timer = setTimeout(this.regularFetchInfo, 0);
  }

  componentWillUnmount() {
    const timer = this.timer;
    this.timer = null;
    if (timer !== null) {
      clearTimeout(timer);
    }
  }

  regularFetchInfo = async () => {
    await this.fetchNodes();
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  fetchNodes = async () => {
    new NodesApi()
      .getOnlineNodesStats()
      .then((nodeStats) => this.setState({ nodeStats }));
  };

  render() {
    const { nodeStats } = this.state;
    const { role } = this.props;
    return (
      <>
        <Row>
          <Link href="/nodes/validators">
            <a
              className={`node-link ${
                role === "validators" ? `node-selected` : ""
              }`}
              id="validator-node"
            >
              <Col className="node-selector align-self-center">
                {nodeStats
                  ? `${nodeStats.validatorsCount}  Validating`
                  : `- Validating`}
              </Col>
            </a>
          </Link>
          <Link href="/nodes/online-nodes">
            <a
              className={`node-link ${
                role === "online-nodes" ? `node-selected` : ""
              }`}
              id="online-node"
            >
              <Col className="node-selector align-self-center">
                {nodeStats
                  ? `${nodeStats.onlineNodesCount} Online-nodes`
                  : `- Online-nodes`}
              </Col>
            </a>
          </Link>
          <Link href="/nodes/proposals">
            <a
              className={`node-link ${
                role === "proposals" ? `node-selected` : ""
              }`}
              id="proposal-node"
            >
              <Col className="node-selector align-self-center">
                {nodeStats
                  ? `${nodeStats.proposalsCount} Proposal-nodes`
                  : `- Proposal-nodes`}
              </Col>
            </a>
          </Link>
        </Row>
        <style jsx global>{`
          .node-selector {
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 1.38px;
            color: #24272a;
            text-transform: uppercase;
            padding: 10px;
            text-decoration: none;
          }

          .node-link {
            text-align: center;
            background: #fff;
            border: 2px solid #e6e6e6;
            box-sizing: border-box;
            border-radius: 25px;
            margin-left: 15px;
            margin-bottom: 15px;
          }

          .node-link:active,
          .node-link:focus {
            border: 2px solid #0066ff;
          }

          .node-selected {
            border: 2px solid #0066ff;
          }

          .node-icon {
            margin: 10px;
          }
        `}</style>
      </>
    );
  }
}
