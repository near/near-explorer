import BN from "bn.js";

import React from "react";
import { Col, Row, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";

import { utils } from "near-api-js";

import { NetworkStatsConsumer } from "../../context/NetworkStatsProvider";
import { showInYocto, formatWithCommas } from "../utils/Balance";
import NearBadge from "./NearBadge";

const NodeBalance = ({
  amount,
  type,
}: {
  amount: BN;
  type: "totalSupply" | "totalStakeAmount" | "seatPriceAmount";
}) => {
  if (!amount) return null;
  let value;
  let suffix;
  if (type === "totalSupply") {
    value = formatWithCommas(
      (amount.div(utils.format.NEAR_NOMINATION).toNumber() / 10 ** 6).toFixed(1)
    );
    suffix = "M";
  } else if (type === "totalStakeAmount") {
    value = formatWithCommas(
      (amount.div(utils.format.NEAR_NOMINATION).toNumber() / 10 ** 6).toFixed(1)
    );
    suffix = "M";
  } else if (type === "seatPriceAmount") {
    value = formatWithCommas(
      amount.div(utils.format.NEAR_NOMINATION).toNumber().toFixed(0)
    );
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
        {value}
        {suffix && <span className="node-balance-suffix">{suffix}</span>}{" "}
        <NearBadge />
      </span>
    </OverlayTrigger>
  );
};

class NodesCard extends React.PureComponent {
  render() {
    return (
      <NetworkStatsConsumer>
        {(context) => (
          <>
            <Row noGutters className="nodes-card">
              <Col xs="12" sm="6" md="6" xl="2">
                <Row noGutters>
                  <Col xs="12" className="nodes-card-title">
                    Nodes validating
                  </Col>
                  <Col xs="12" className="nodes-card-text validating">
                    {context.networkStats ? (
                      context.networkStats.currentValidatorsCount
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
                    {context.epochStartBlock ? (
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
                    {context.networkStats ? (
                      <NodeBalance
                        amount={context.networkStats.totalStake}
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
                    {context.networkStats ? (
                      <NodeBalance
                        amount={context.networkStats.seatPrice}
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

              .node-balance-suffix {
                font-size: 25px;
                line-height: 35px;
                align-self: flex-end;
              }

              .near-badge {
                margin-left: 10px;
              }

              .nodes-card-text.validating {
                color: #00c08b;
              }

              @media (max-width: 768px) {
                .nodes-card {
                  margin-top: 32px;
                  padding: 8px 16px 16px;
                }

                .nodes-card-text {
                  font-size: 20px;
                }
                .node-balance-suffix {
                  font-size: 14px;
                  line-height: 22px;
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
      </NetworkStatsConsumer>
    );
  }
}

export default NodesCard;
