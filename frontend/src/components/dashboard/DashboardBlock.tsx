import * as React from "react";

import { Trans, useTranslation } from "next-i18next";
import { Col, Row } from "react-bootstrap";

import CopyToClipboard from "@/frontend/components/utils/CopyToClipboard";
import DashboardCard from "@/frontend/components/utils/DashboardCard";
import Link from "@/frontend/components/utils/Link";
import LongCardCell from "@/frontend/components/utils/LongCardCell";
import Term from "@/frontend/components/utils/Term";
import { useFormatNumber } from "@/frontend/hooks/use-format-number";
import { subscriptions } from "@/frontend/hooks/use-subscription";
import { styled } from "@/frontend/libraries/styles";

const ElementWrapper = styled("div", {
  display: "flex",
  alignItems: "center",

  "& > *:not(:first-child)": {
    marginLeft: 8,
  },
});

const DashboardBlock: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const latestBlockSub = subscriptions.latestBlock.useSubscription();
  const blockProductionSpeedSub =
    subscriptions.blockProductionSpeed.useSubscription();
  const formatNumber = useFormatNumber();

  return (
    <DashboardCard
      dataTestId="dashboard-blocks"
      className="ml-md-4"
      iconPath="/static/images/icon-blocks.svg"
      title={t("common.blocks.blocks")}
      headerRight={
        <Link href="/blocks" css={{ color: "#007bff" }}>
          {t("button.view_all")}
        </Link>
      }
    >
      <Row noGutters>
        <Col xs="6" md="12">
          <LongCardCell
            title={
              <Term
                title={t(
                  "component.dashboard.DashboardBlock.block_height.title"
                )}
                text={
                  <Trans
                    i18nKey="component.dashboard.DashboardBlock.block_height.text"
                    components={{ p: <p /> }}
                  />
                }
                href="https://docs.near.org/docs/concepts/new-to-near"
              />
            }
            subscription={latestBlockSub}
          >
            {(latestBlock) => (
              <ElementWrapper>
                <span>{formatNumber(latestBlock.height)}</span>
                <CopyToClipboard text={latestBlock.height.toString()} />
              </ElementWrapper>
            )}
          </LongCardCell>
        </Col>
        <Col xs="6" md="12">
          <LongCardCell
            title={
              <Term
                title={t(
                  "component.dashboard.DashboardBlock.avg_block_time.title"
                )}
                text={t(
                  "component.dashboard.DashboardBlock.avg_block_time.text"
                )}
              />
            }
            subscription={blockProductionSpeedSub}
          >
            {(blockProductionSpeed) => (
              <>
                {blockProductionSpeed === 0
                  ? t(
                      "component.dashboard.DashboardBlock.avg_block_time.unavailable"
                    )
                  : `${(1.0 / blockProductionSpeed).toFixed(4)} ${t(
                      "common.unit.seconds"
                    )}`}
              </>
            )}
          </LongCardCell>
        </Col>
      </Row>
    </DashboardCard>
  );
});

export default DashboardBlock;
