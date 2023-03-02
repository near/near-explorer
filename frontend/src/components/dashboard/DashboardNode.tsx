import * as React from "react";

import { useTranslation } from "next-i18next";
import { Col, Row } from "react-bootstrap";

import DashboardCard from "@explorer/frontend/components/utils/DashboardCard";
import LongCardCell, {
  CardCellText,
} from "@explorer/frontend/components/utils/LongCardCell";
import Term from "@explorer/frontend/components/utils/Term";
import { useNetworkStats } from "@explorer/frontend/hooks/subscriptions";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import { styled } from "@explorer/frontend/libraries/styles";

const CountCell = styled(LongCardCell, {
  [`& ${CardCellText}`]: {
    color: "#00c08b",
  },
});

const DashboardNode: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { data: networkStats } = useNetworkStats();
  const onlineNodesCountSub = useSubscription(["onlineNodesCount"]);

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
            loading={onlineNodesCountSub.status === "loading"}
            text={
              onlineNodesCountSub.status === "success"
                ? onlineNodesCountSub.data === 0
                  ? t(
                      "component.dashboard.DashboardNode.nodes_validating.unavailable"
                    )
                  : onlineNodesCountSub.data.toLocaleString()
                : null
            }
          />
        </Col>
        <Col xs="6" md="12">
          <CountCell
            title={
              <Term
                title={t(
                  "component.dashboard.DashboardNode.nodes_validating.title"
                )}
                text={t(
                  "component.dashboard.DashboardNode.nodes_validating.text"
                )}
                href="https://docs.near.org/docs/roles/integrator/faq#validators"
              />
            }
            loading={networkStats === undefined}
            text={networkStats?.currentValidatorsCount.toLocaleString()}
            href="/nodes/validators"
          />
        </Col>
      </Row>
    </DashboardCard>
  );
});

export default DashboardNode;
