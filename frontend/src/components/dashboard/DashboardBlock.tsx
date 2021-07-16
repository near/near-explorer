import React from "react";
import { Col, Row } from "react-bootstrap";

import { DatabaseConsumer } from "../../context/DatabaseProvider";

import DashboardCard from "../utils/DashboardCard";
import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";
import Link from "../utils/Link";

import { Translate } from "react-localize-redux";

export interface Props {
  className?: string;
}

const DashboardBlock = ({ className }: Props) => (
  <Translate>
    {({ translate }) => (
      <DatabaseConsumer>
        {(context) => (
          <DashboardCard
            className={`block-card ${className || ""}`}
            iconPath="/static/images/icon-blocks.svg"
            title={translate("common.blocks.blocks")}
            headerRight={
              <Link href="/blocks">
                <a>
                  <Translate id="button.view_all" />
                </a>
              </Link>
            }
          >
            <Row noGutters>
              <Col xs="6" md="12">
                <LongCardCell
                  title={
                    <Term
                      title={translate(
                        "component.dashboard.DashboardBlock.block_height.title"
                      )}
                      text={translate(
                        "component.dashboard.DashboardBlock.block_height.text"
                      )}
                      href={"https://docs.near.org/docs/concepts/new-to-near"}
                    />
                  }
                  loading={typeof context.latestBlockHeight === "undefined"}
                  text={context.latestBlockHeight?.toLocaleString()}
                />
              </Col>
              <Col xs="6" md="12">
                <LongCardCell
                  title={
                    <Term
                      title={translate(
                        "component.dashboard.DashboardBlock.avg_block_time.title"
                      )}
                      text={translate(
                        "component.dashboard.DashboardBlock.avg_block_time.text"
                      )}
                    />
                  }
                  loading={
                    typeof context.recentBlockProductionSpeed === "undefined"
                  }
                  text={
                    typeof context.recentBlockProductionSpeed !== "undefined"
                      ? `${(1.0 / context.recentBlockProductionSpeed).toFixed(
                          4
                        )} ${translate("common.unit.seconds").toString()}`
                      : undefined
                  }
                />
              </Col>
            </Row>
          </DashboardCard>
        )}
      </DatabaseConsumer>
    )}
  </Translate>
);

export default DashboardBlock;
