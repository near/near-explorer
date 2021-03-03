import React from "react";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";

import * as N from "../../libraries/explorer-wamp/nodes";
import Balance from "../utils/Balance";

interface Props {
  node: N.Proposal;
}

class ProposalRow extends React.PureComponent<Props> {
  render() {
    const { node } = this.props;
    return (
      <Row className="node-row mx-0">
        <Col md="auto" xs="1" className="pr-0">
          <OverlayTrigger
            placement={"right"}
            overlay={
              <Tooltip id="nodes">node staked to be new validating one</Tooltip>
            }
          >
            <p>
              <img
                src={"/static/images/icon-m-node-proposal.svg"}
                style={{ width: "15px", verticalAlign: "text-top" }}
              />
            </p>
          </OverlayTrigger>
        </Col>
        <Col md="7" xs="7">
          <Row>
            <Col className="node-row-title">
              <p>
                @{node.account_id}
                {"  "}
                <span>
                  Staking {node.stake ? <Balance amount={node.stake} /> : "-"}
                </span>
              </p>
            </Col>
          </Row>
        </Col>
        <Col md="3" xs="3" className="ml-auto text-right">
          <Row>
            <Col className="node-row-txid" title={node.public_key}>
              {node.public_key.substring(8, 20)}...
            </Col>
          </Row>
        </Col>
        <style jsx global>{`
          .node-row {
            padding-top: 10px;
            border-top: solid 2px #f8f8f8;
          }

          .node-row:hover {
            background: rgba(0, 0, 0, 0.1);
          }

          .node-row-bottom {
            border-bottom: solid 2px #f8f8f8;
          }

          .node-row-title {
            font-size: 14px;
            font-weight: 500;
            line-height: 1.29;
            color: #24272a;
          }

          .node-row-txid {
            font-size: 14px;
            font-weight: 500;
            line-height: 1.29;
            color: #4a4f54;
          }
        `}</style>
      </Row>
    );
  }
}

export default ProposalRow;
