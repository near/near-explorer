import React from "react";
import { Col, Row } from "react-bootstrap";

import { NodeStatsConsumer } from "../../context/NodeStatsProvider";

import DashboardCard from "../utils/DashboardCard";
import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";

const DashboardNode = () => (
  <NodeStatsConsumer>
    {(stats) => (
      <DashboardCard
        iconPath="/static/images/icon-nodes.svg"
        title="Nodes"
        className="node-card"
      >
        <Row noGutters>
          <Col xs="6" md="12">
            <LongCardCell
              title={
                <Term
                  title={"Nodes online"}
                  text={"Total number of online nodes. "}
                  href={
                    "https://docs.near.org/docs/validator/staking#run-the-node"
                  }
                />
              }
              loading={typeof stats.onlineNodeAmount === "undefined"}
              text={stats.onlineNodeAmount?.toLocaleString()}
            />
          </Col>
          <Col xs="6" md="12">
            <LongCardCell
              title={
                <Term
                  title={"Nodes validating"}
                  text={"Total number of validating nodes. "}
                  href={
                    "https://docs.near.org/docs/roles/integrator/faq#validators"
                  }
                />
              }
              loading={typeof stats.validatorAmount === "undefined"}
              text={stats.validatorAmount?.toLocaleString()}
              href={"/nodes/validators"}
              className="dashboard-validating-nodes-count"
            />
          </Col>
        </Row>
        <style jsx global>{`
          .dashboard-validating-nodes-count .card-cell-text {
            color: #00c08b;
          }
        `}</style>
      </DashboardCard>
    )}
  </NodeStatsConsumer>
);

export default DashboardNode;
