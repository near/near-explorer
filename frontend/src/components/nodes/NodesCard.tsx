import React from "react";
import { Badge, Col, Row } from "react-bootstrap";

import { NodeStatsConsumer } from "../../context/NodeStatsProvider";
import Balance from "../utils/Balance";

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

class NodesCard extends React.PureComponent {
  render() {
    return (
      <NodeStatsConsumer>
        {(context) => (
          <>
            <Row noGutters className="nodes-card">
              <Col xs="6" md="2">
                <Row noGutters>
                  <Col xs="12" className="nodes-card-title">
                    Nodes validating
                  </Col>
                  <Col xs="12" className="nodes-card-text validating">
                    {typeof context.validatorAmount !== "undefined"
                      ? context.validatorAmount
                      : "-"}
                  </Col>
                </Row>
              </Col>

              <Col xs="6" md="4">
                <Row noGutters>
                  <Col xs="12" className="nodes-card-title">
                    Circulating Supply
                  </Col>
                  <Col xs="12" className="nodes-card-text">
                    {" "}
                    000 / 0000
                    <NearBadge />
                  </Col>
                </Row>
              </Col>

              <Col xs="12" md="3">
                <Row noGutters>
                  <Col xs="12" className="nodes-card-title">
                    Active Stake
                  </Col>
                  <Col xs="12" className="nodes-card-text">
                    {" "}
                    000.000
                    <NearBadge />
                  </Col>
                </Row>
              </Col>

              <Col xs="12" md="3">
                <Row noGutters>
                  <Col xs="12" className="nodes-card-title">
                    Seat Price
                  </Col>
                  <Col xs="12" className="nodes-card-text">
                    {context.seatPriceAmount ? (
                      <Balance amount={context.seatPriceAmount} />
                    ) : (
                      "-"
                    )}
                    <NearBadge />
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

              .nodes-card-text.validating {
                color: #00c08b;
              }

              @media (max-width: 768px) {
                .nodes-card {
                  margin-top: 32px;
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
