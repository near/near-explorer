import * as React from "react";

import { useTranslation } from "next-i18next";
import { Col, Row } from "react-bootstrap";

import DashboardCard from "@explorer/frontend/components/utils/DashboardCard";
import LinkWrapper from "@explorer/frontend/components/utils/Link";
import LongCardCell from "@explorer/frontend/components/utils/LongCardCell";
import Term from "@explorer/frontend/components/utils/Term";
import { useFormatNumber } from "@explorer/frontend/hooks/use-format-number";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";

const DashboardNode: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const networkStatsSub = useSubscription(["network-stats"]);
  const onlineNodesCountSub = useSubscription(["onlineNodesCount"]);
  const formatNumber = useFormatNumber();

  return (
    <DashboardCard
      dataId="nodes"
      iconPath="/static/images/icon-nodes.svg"
      title={t("common.nodes.title")}
    >
      <Row noGutters>
        <Col xs="6" md="12">
          <LongCardCell
            title={
              <Term
                title={t(
                  "component.dashboard.DashboardNode.nodes_online.title"
                )}
                text={t("component.dashboard.DashboardNode.nodes_online.text")}
                href="https://docs.near.org/docs/develop/node/intro/what-is-a-node"
              />
            }
            subscription={onlineNodesCountSub}
          >
            {(onlineNodesCount) => (
              <>
                {onlineNodesCount === 0
                  ? t(
                      "component.dashboard.DashboardNode.nodes_validating.unavailable"
                    )
                  : formatNumber(onlineNodesCount)}
              </>
            )}
          </LongCardCell>
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
                href="https://near.org/about/network/validators/"
              />
            }
            subscription={networkStatsSub}
            textCss={{ color: "#00c08b" }}
          >
            {(networkStats) => (
              <LinkWrapper href="/nodes/validators">
                {formatNumber(networkStats.currentValidatorsCount)}
              </LinkWrapper>
            )}
          </LongCardCell>
        </Col>
      </Row>
    </DashboardCard>
  );
});

export default DashboardNode;
