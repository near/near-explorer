import React from "react";
import { Col, Row } from "react-bootstrap";

import { NetworkStatsConsumer } from "../../context/NetworkStatsProvider";

import DashboardCard from "../utils/DashboardCard";
import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";

import { Translate } from "react-localize-redux";

const DashboardNode = () => (
  <Translate>
    {({ translate }) => (
      <NetworkStatsConsumer>
        {({ networkStats }) => (
          <DashboardCard
            iconPath="/static/images/icon-nodes.svg"
            title={translate("model.nodes.title").toString()}
            className="node-card"
          >
            <Row noGutters>
              <Col xs="6" md="12">
                <LongCardCell
                  title={
                    <Term
                      title={translate(
                        "component.dashboard.DashboardNode.nodes_online.title"
                      ).toString()}
                      text={
                        translate(
                          "component.dashboard.DashboardNode.nodes_online.desc"
                        ).toString() + " "
                      }
                      href={
                        "https://docs.near.org/docs/validator/staking#run-the-node"
                      }
                    />
                  }
                  loading={typeof networkStats === "undefined"}
                  text={networkStats?.onlineNodesCount.toLocaleString()}
                />
              </Col>
              <Col xs="6" md="12">
                <LongCardCell
                  title={
                    <Term
                      title={translate(
                        "component.dashboard.DashboardNode.nodes_validating.title"
                      ).toString()}
                      text={
                        translate(
                          "component.dashboard.DashboardNode.nodes_validating.desc"
                        ).toString() + " "
                      }
                      href={
                        "https://docs.near.org/docs/roles/integrator/faq#validators"
                      }
                    />
                  }
                  loading={typeof networkStats === "undefined"}
                  text={networkStats?.currentValidatorsCount.toLocaleString()}
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
      </NetworkStatsConsumer>
    )}
  </Translate>
);

export default DashboardNode;
