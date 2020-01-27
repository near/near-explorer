import { Row, Col } from "react-bootstrap";
import FlipMove from "../utils/FlipMove";
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
    this.timer = null;
  }

  fetchInfo = async () => {
    const nodes = await this._nodesApi.getNodesInfo();
    this.setState({ loading: false, nodes });
  };

  regularFetchInfo = async () => {
    await this.fetchInfo();
    if (this.timer !== null) {
      this.timer = setTimeout(this.regularFetchInfo, 10000);
    }
  };

  render() {
    const { nodes, loading } = this.state;
    return (
      <LoadingOverlay active={loading} spinner text="Loading nodes...">
        {nodes && (
          <div>
            <Row>
              <Col md="auto" className="align-self-center pagination-total">
                {`${nodes.length.toLocaleString()} Total`}
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
          {nodes &&
            nodes.map(node => {
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
      </LoadingOverlay>
    );
  }
}
