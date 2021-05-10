import React from "react";
import {
  Badge,
  Col,
  Row,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap";

import { NodeStatsConsumer } from "../../context/NodeStatsProvider";
import { showInYocto } from "../utils/Balance";

const NearBadge = () => (
  <Badge variant="light" className="nodes-card-badge">
    NEAR
    <style jsx global>{`
      .nodes-card-badge {
        border: 1px solid #f0f0f1;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        color: #a2a2a8;
        background: transparent;
      }
    `}</style>
  </Badge>
);

const NodeBalance = ({ amount, type }: any) => {
  if (!amount) return null;
  let value;
  if (type === "totalSupply") {
    value = (Number(amount) / 10 ** (24 + 6)).toFixed(1);
  } else if (type === "totalStakeAmount") {
    value = (Number(amount) / 10 ** (24 + 3)).toFixed(1);
  } else if (type === "seatPriceAmount") {
    value = (Number(amount) / 10 ** 24).toFixed(1);
  } else {
    value = amount;
  }

  const amountPrecise = showInYocto(amount);
  return (
    <OverlayTrigger
      placement={"bottom"}
      overlay={<Tooltip id={type}>{amountPrecise}</Tooltip>}
    >
      <span className="node-balance-text">
        {value} <NearBadge />
      </span>
    </OverlayTrigger>
  );
};

class NodesCard extends React.PureComponent {
  render() {
    return (
      <NodeStatsConsumer>
        {(context) => (
          <>
            <Row noGutters className="nodes-card">
              <Col xs="12" sm="6" md="6" xl="2">
                <Row noGutters>
                  <Col xs="12" className="nodes-card-title">
                    Nodes validating
                  </Col>
                  <Col xs="12" className="nodes-card-text validating">
                    {typeof context.validatorAmount !== "undefined" ? (
                      context.validatorAmount
                    ) : (
                      <Spinner animation="border" size="sm" />
                    )}
                  </Col>
                </Row>
              </Col>

              <Col xs="12" sm="6" md="6" xl="3">
                <Row noGutters>
                  <Col xs="12" className="nodes-card-title">
                    Total Supply
                  </Col>
                  <Col xs="12" className="nodes-card-text">
                    {" "}
                    {context.epochStartBlock?.totalSupply ? (
                      <NodeBalance
                        amount={context.epochStartBlock.totalSupply}
                        type="totalSupply"
                      />
                    ) : (
                      <Spinner animation="border" size="sm" />
                    )}
                  </Col>
                </Row>
              </Col>

              <Col xs="12" md="6" xl="3">
                <Row noGutters>
                  <Col xs="12" className="nodes-card-title">
                    Total Stake
                  </Col>
                  <Col xs="12" className="nodes-card-text">
                    {context.totalStakeAmount ? (
                      <NodeBalance
                        amount={context.totalStakeAmount.toString()}
                        type="totalStakeAmount"
                      />
                    ) : (
                      <Spinner animation="border" size="sm" />
                    )}
                  </Col>
                </Row>
              </Col>

              <Col xs="12" md="6" xl="4">
                <Row noGutters>
                  <Col xs="12" className="nodes-card-title">
                    Seat Price
                  </Col>
                  <Col xs="12" className="nodes-card-text">
                    {context.seatPriceAmount ? (
                      <NodeBalance
                        amount={context.seatPriceAmount}
                        type="seatPriceAmount"
                      />
                    ) : (
                      <Spinner animation="border" size="sm" />
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <style jsx global>{`
              .nodes-card {
                background: #ffffff;
                border: 1px solid #f0f0f1;
                box-shadow: 0px 2px 2px rgba(17, 22, 24, 0.04);
                border-radius: 8px;
                padding: 48px 32px;
                margin-top: 50px;
              }

              .nodes-card-title {
                color: #a2a2a8;
                font-weight: 500;
                font-size: 14px;
                line-height: 17px;
                margin: 8px 0;
              }

              .nodes-card-text {
                font-weight: 900;
                font-size: 31px;
                line-height: 130%;
                color: #272729;
                font-feature-settings: "zero", on;
              }

              .node-balance-text {
                display: flex;
                align-items: center;
              }

              .nodes-card-badge {
                margin-left: 10px;
              }

              .nodes-card-text.validating {
                color: #00c08b;
              }

              @media (max-width: 768px) {
                .nodes-card {
                  margin-top: 32px;
                }
                .nodes-card-text {
                  font-size: 20px;
                }
              }
              @media (max-width: 355px) {
                .nodes-card-text {
                  font-size: 14px;
                }
              }
            `}</style>
          </>
        )}
      </NodeStatsConsumer>
    );
  }
}

export default NodesCard;
