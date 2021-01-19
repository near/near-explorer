import Link from "next/link";
import React from "react";
import { Col, Row } from "react-bootstrap";

import { DatabaseConsumer } from "../../context/DatabaseProvider";

import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";

export default () => (
  <DatabaseConsumer>
    {(context) => (
      <Row className="node-card" noGutters>
        <Row className="node-card-header" noGutters>
          <img src="/static/images/icon-blocks.svg" className="node-icon" />
          Blocks
          <Link href="/blocks">
            <a className="block-view-all">View All</a>
          </Link>
        </Row>
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
                    <a href="https://docs.near.org/docs/concepts/overview">
                      {"Learn more about the key concepts"}
                    </a>
                  </p>
                </Term>
              }
              text={<p>{context.latestBlockHeight.toLocaleString()}</p>}
              loading={!context.latestBlockHeight}
            />
          </Col>
          <Col xs="6" md="12">
            <LongCardCell
              title={
                <Term title={"Avg block time"}>
                  {"Average time for producing one block "}
                </Term>
              }
              text={
                <p>{(60 / context.numberOfLastMinuteBlocks).toFixed(4)} s</p>
              }
              loading={false}
            />
          </Col>
        </Row>
        <style jsx global>{`
          .block-view-all {
            margin-left: 157px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            color: #0072ce;
          }

          @media (max-width: 415px) {
            .block-view-all {
              margin-left: 256px;
              margin-top: -25px;
            }
          }

          @media (max-width: 360px) {
            .block-view-all {
              margin-left: 180px;
            }
          }
        `}</style>
      </Row>
    )}
  </DatabaseConsumer>
);
