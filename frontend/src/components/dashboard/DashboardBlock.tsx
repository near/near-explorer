import * as React from "react";
import { Col, Row } from "react-bootstrap";

import DashboardCard from "../utils/DashboardCard";
import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";
import Link from "../utils/Link";

import { Trans, useTranslation } from "react-i18next";
import { useSubscription } from "../../hooks/use-subscription";
import CopyToClipboard from "../utils/CopyToClipboard";
import { styled } from "../../libraries/styles";

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
                href={"https://docs.near.org/docs/concepts/new-to-near"}
              />
            }
            loading={latestBlockSub.status === "loading"}
            text={
              latestBlockSub.status === "success" ? (
                <ElementWrapper>
                  <span>{latestBlockSub.data.height.toLocaleString()}</span>
                  <CopyToClipboard
                    text={latestBlockSub.data.height.toString()}
                  />
                </ElementWrapper>
              ) : null
            }
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
            loading={blockProductionSpeedSub.status === "loading"}
            text={
              blockProductionSpeedSub.status === "success"
                ? `${(1.0 / blockProductionSpeedSub.data).toFixed(4)} ${t(
                    "common.unit.seconds"
                  )}`
                : undefined
            }
          />
        </Col>
      </Row>
    </DashboardCard>
  );
});

export default DashboardBlock;
