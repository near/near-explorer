import * as React from "react";

import { Trans, useTranslation } from "next-i18next";
import { Col, Row } from "react-bootstrap";

import CopyToClipboard from "@explorer/frontend/components/utils/CopyToClipboard";
import DashboardCard from "@explorer/frontend/components/utils/DashboardCard";
import Link from "@explorer/frontend/components/utils/Link";
import LongCardCell from "@explorer/frontend/components/utils/LongCardCell";
import Term from "@explorer/frontend/components/utils/Term";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import { styled } from "@explorer/frontend/libraries/styles";

const ElementWrapper = styled("div", {
  display: "flex",
  alignItems: "center",

  "& > *:not(:first-child)": {
    marginLeft: 8,
  },
});

const DashboardBlock: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const latestBlockSub = useSubscription(["latestBlock"]);
  const blockProductionSpeedSub = useSubscription(["blockProductionSpeed"]);

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
                href="https://docs.near.org/docs/concepts/new-to-near"
              />
            }
            subscription={latestBlockSub}
          >
            {(latestBlock) => (
              <ElementWrapper>
                <span>{latestBlock.height.toLocaleString()}</span>
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
