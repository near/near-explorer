import { Row, Col } from "react-bootstrap";
import FlipMove from "react-flip-move";
import LoadingOverlay from "react-loading-overlay";

import NodesApi from "../../libraries/explorer-wamp/nodes";

import NodeRow from "./NodeRow";

export default class extends React.Component {
  state = { loading: true, nodes: null };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._nodesApi = new NodesApi();
    this.regularFetchInfo();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = false;
  }

  fetchInfo = async () => {
    const nodes = await this._nodesApi.getNodesInfo();
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
                //display more attributes
                // <NodeRow
                //   key={node.nodeId}
                //   ipAddress={node.ipAddress}
                //   moniker={node.moniker}
                //   accountId={node.accountId}
                //   nodeId={node.nodeId}
                //   lastSeen={node.lastSeen}
                //   lastHeight={node.lastHeight}
                //   isValidator={node.isValidator}
                //   agentName={node.agentName}
                //   agentVersion={node.agentVersion}
                //   agentBuild={node.agentBuild}
                // />
                <NodeRow
                  key={node.nodeId}
                  ipAddress={node.ipAddress}
                  moniker={node.moniker}
                  accountId={node.accountId}
                  nodeId={node.nodeId}
                  lastSeen={node.lastSeen}
                  lastHeight={node.lastHeight}
                />
              );
            })}
        </FlipMove>
      </LoadingOverlay>
    );
  }
}
