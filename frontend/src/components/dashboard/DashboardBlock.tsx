import React from "react";
import { Col, Row } from "react-bootstrap";

import DashboardCard from "../utils/DashboardCard";
import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";
import Link from "../utils/Link";

import { Trans, useTranslation } from "react-i18next";
import { useChainBlockStats } from "../../hooks/subscriptions";
import { useLatestBlockHeight } from "../../hooks/data";

const DashboardBlock: React.FC = () => {
  const { t } = useTranslation();
  const latestBlockHeight = useLatestBlockHeight();
  const recentBlockProductionSpeed = useChainBlockStats()
    ?.recentBlockProductionSpeed;

  return (
    <DashboardCard
      dataId="blocks"
      className="ml-md-4"
      iconPath="/static/images/icon-blocks.svg"
      title={t("common.blocks.blocks")}
      headerRight={
        <Link href="/blocks">
          <a>{t("button.view_all")}</a>
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
                href={"https://docs.near.org/docs/concepts/new-to-near"}
              />
            }
            loading={latestBlockHeight === undefined}
            text={latestBlockHeight?.toLocaleString()}
          />
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
            loading={recentBlockProductionSpeed === undefined}
            text={
              recentBlockProductionSpeed !== undefined
                ? `${(1.0 / recentBlockProductionSpeed).toFixed(4)} ${t(
                    "common.unit.seconds"
                  )}`
                : undefined
            }
          />
        </Col>
      </Row>
    </DashboardCard>
  );
};

export default DashboardBlock;
