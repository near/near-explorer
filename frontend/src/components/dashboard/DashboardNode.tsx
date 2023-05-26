import * as React from "react";

import { useTranslation } from "next-i18next";
import { Col, Row } from "react-bootstrap";

import { DashboardCard } from "@/frontend/components/utils/DashboardCard";
import { Link } from "@/frontend/components/utils/Link";
import { LongCardCell } from "@/frontend/components/utils/LongCardCell";
import { Term } from "@/frontend/components/utils/Term";
import { useFormatNumber } from "@/frontend/hooks/use-format-number";
import { subscriptions } from "@/frontend/hooks/use-subscription";

export const DashboardNode: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const currentValidatorsCountSub =
    subscriptions.currentValidatorsCount.useSubscription();
  const onlineNodesCountSub = subscriptions.onlineNodesCount.useSubscription();
  const formatNumber = useFormatNumber();

  return (
    <DashboardCard
      dataTestId="dashboard-nodes"
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
            subscription={currentValidatorsCountSub}
            textCss={{ color: "#00c08b" }}
          >
            {(currentValidatorsCount) => (
              <Link href="/nodes/validators">
                {formatNumber(currentValidatorsCount)}
              </Link>
            )}
          </LongCardCell>
        </Col>
      </Row>
    </DashboardCard>
  );
});
