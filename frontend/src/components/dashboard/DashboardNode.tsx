import Link from "next/link";
import React from "react";
import { Col, Row } from "react-bootstrap";

import { NodeStatsConsumer } from "../../context/NodeStatsProvider";

import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";

export default () => (
  <NodeStatsConsumer>
    {(stats) => (
      <Row className="node-card" noGutters>
        <Row className="node-card-header" noGutters>
          <p>
            <img src="/static/images/icon-nodes.svg" className="node-icon" />
            Nodes
          </p>
        </Row>
        <Row noGutters>
          <Col xs="6" md="12">
            <LongCardCell
              title={
                <Term title={"Nodes online"}>
                  {"Total number of online nodes. "}
                  <a
                    href={
                      "https://docs.near.org/docs/validator/staking#run-the-node"
                    }
                  >
                    docs
                  </a>
                </Term>
              }
              text={
                <Link href="/nodes/[role]" as={`/nodes/online-nodes`}>
                  <a>
                    {stats.onlineNodeAmount.toLocaleString()}
                    <img
                      src="/static/images/right-arrow.svg"
                      className="right-arrow"
                    />
                  </a>
                </Link>
              }
              loading={!stats.onlineNodeAmount}
            />
          </Col>
          <Col xs="6" md="12">
            <LongCardCell
              title={
                <Term title={"Nodes validating"}>
                  {"Total number of validating nodes. "}
                  <a
                    href={
                      "https://docs.near.org/docs/roles/integrator/faq#validators"
                    }
                  >
                    docs
                  </a>
                </Term>
              }
              text={
                <Link href="/nodes/[role]" as={`/nodes/validators`}>
                  <a>
                    {stats.validatorAmount.toLocaleString()}
                    <img
                      src="/static/images/right-arrow.svg"
                      className="right-arrow"
                    />
                  </a>
                </Link>
              }
              loading={!stats.validatorAmount}
            />
          </Col>
        </Row>
        <style jsx global>{`
          .node-card {
            margin-top: 81px;
            width: 360px;
            height: 275px;
            background: #ffffff;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
          }

          .node-card-header {
            height: 72px;
            width: 100%;
            font-weight: 800;
            font-size: 18px;
            line-height: 22px;
            padding: 25px;
            border-bottom: 2px solid #f1f1f1;
          }

          .node-icon {
            width: 24px !important;
            margin-right: 8px;
          }

          .right-arrow {
            margin-left: 200px;
          }
        `}</style>
      </Row>
    )}
  </NodeStatsConsumer>
);
