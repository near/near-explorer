import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { NetworkStatsConsumer } from "../../context/NetworkStatsProvider";

import DashboardCard from "../utils/DashboardCard";
import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";

const DashboardNode = () => {
  const { t } = useTranslation();
  return (
    <NetworkStatsConsumer>
      {({ networkStats }) => (
        <DashboardCard
          iconPath="/static/images/icon-nodes.svg"
          title={t("common.nodes.title")}
          className="node-card"
        >
          <Row noGutters>
            <Col xs="6" md="12">
              <LongCardCell
                title={
                  <Term
                    title={t(
                      "component.dashboard.DashboardNode.nodes_online.title"
                    )}
                    text={t(
                      "component.dashboard.DashboardNode.nodes_online.text"
                    )}
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
                    title={t(
                      "component.dashboard.DashboardNode.nodes_validating.title"
                    )}
                    text={t(
                      "component.dashboard.DashboardNode.nodes_validating.text"
                    )}
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
  );
};

export default DashboardNode;
