import { Row, Col } from "react-bootstrap";
import FlipMove from "react-flip-move";
import LoadingOverlay from "react-loading-overlay";

import Content from "./Content";
import NodesApi from "./api/Nodes";

import NodeRow from "./nodes/NodeRow";

export default class extends React.Component {
  state = { loading: true, nodes: null };

  componentDidMount() {
    this.regularFetchInfo();
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = false;
  }

  fetchInfo = async () => {
    const nodes = await NodesApi.getNodesInfo();
    await this.setState({ loading: false, nodes });
  };

  regularFetchInfo = async () => {
    await this.fetchInfo();
    if (this.timer !== false) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  render() {
    return (
      <Content title="Nodes">
        <LoadingOverlay
          active={this.state.loading}
          spinner
          text="Loading nodes..."
        >
          {this.state.nodes && (
            <div>
              <Row>
                <Col md="auto" className="align-self-center pagination-total">
                  {`${this.state.nodes.length.toLocaleString()} Total`}
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

          <FlipMove
            duration={1000}
            staggerDurationBy={0}
            style={{ minHeight: "300px" }}
          >
            {this.state.nodes &&
              this.state.nodes.map(node => {
                return (
                  <NodeRow
                    key={node.node_id}
                    ipAddress={node.ip_address}
                    moniker={node.moniker}
                    accountId={node.account_id}
                    nodeId={node.node_id}
                    lastSeen={node.last_seen}
                    lastHeight={node.last_height}
                  />
                );
              })}
          </FlipMove>
        </LoadingOverlay>
      </Content>
    );
  }
}
