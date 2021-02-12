import Link from "next/link";
import React from "react";
import { Col, Row } from "react-bootstrap";

import { DatabaseConsumer } from "../../context/DatabaseProvider";

import DashboardCard from "../utils/DashboardCard";
import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";

export interface Props {
  className?: string;
}

export default ({ className }: Props) => (
  <DatabaseConsumer>
    {(context) => (
      <DashboardCard
        className={`block-card ${className || ""}`}
        iconPath="/static/images/icon-blocks.svg"
        title="Blocks"
        headerRight={
          <Link href="/blocks">
            <a>View All</a>
          </Link>
        }
      >
        <Row noGutters>
          <Col xs="6" md="12">
            <LongCardCell
              title={
                <Term title={"Block Height"}>
                  <p>{`The most recent block height recorded to the blockchain.`}</p>
                  <p>{`The block height is a sequential number of the most recent block in the blockchain.`}</p>
                  <p>{`For example, a block height of 1000 indicates that up to 1001 blocks may exist in the blockchain (genesis + blocks 0-1000).
                In NEAR, there is not guaranteed to be a block for each sequential number, e.g. block 982 does not necessarily exist.`}</p>
                  <p>
                    <a href="https://docs.near.org/docs/concepts/new-to-near">
                      {"Learn more about the key concepts"}
                    </a>
                  </p>
                </Term>
              }
              loading={typeof context.latestBlockHeight === "undefined"}
              text={context.latestBlockHeight?.toLocaleString()}
            />
          </Col>
          <Col xs="6" md="12">
            <LongCardCell
              title={
                <Term title={"Avg block time"}>
                  {"Average time for producing one block "}
                </Term>
              }
              loading={
                typeof context.recentBlockProductionSpeed === "undefined"
              }
              text={
                typeof context.recentBlockProductionSpeed !== "undefined"
                  ? `${context.recentBlockProductionSpeed.toFixed(4)} s`
                  : undefined
              }
            />
          </Col>
        </Row>
      </DashboardCard>
    )}
  </DatabaseConsumer>
);