import Link from "next/link";

import React from "react";
import { Col, Row } from "react-bootstrap";

import { DatabaseConsumer } from "../../context/DatabaseProvider";
import { NodeStatsConsumer } from "../../context/NodeStatsProvider";

import CardCell from "../utils/CardCell";
import Term from "../utils/Term";
import Search from "../utils/Search";

export default class extends React.Component {
  render() {
    return (
      <div className="dashboard-info-container">
        <DatabaseConsumer>
          {(context) => (
            <Row noGutters>
              <NodeStatsConsumer>
                {(stats) => (
                  <Col xs="12" md="3">
                    <CardCell
                      title={
                        <Term title={"Nodes Online"}>
                          {
                            "Total number of validating nodes / Total number of online nodes. "
                          }
                          <a
                            href={
                              "https://docs.near.org/docs/roles/integrator/faq#validators"
                            }
                          >
                            docs
                          </a>
                        </Term>
                      }
                      imgLink="/static/images/icon-m-node-online.svg"
                      text={
                        <Link href="/nodes/[role]" as={`/nodes/validators`}>
                          <a className="dashboard-link">
                            {stats.validatorAmount.toLocaleString()}/
                            {stats.onlineNodeAmount.toLocaleString()}
                          </a>
                        </Link>
                      }
                      className="border-0"
                      loading={
                        !stats.validatorAmount && !stats.onlineNodeAmount
                      }
                    />
                  </Col>
                )}
              </NodeStatsConsumer>

              <Col xs="12" md="3">
                <CardCell
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
                  imgLink="/static/images/icon-m-height.svg"
                  text={context.lastBlockHeight.toLocaleString()}
                  loading={!context.lastBlockHeight}
                />
              </Col>
              <Col xs="12" md="2">
                <CardCell
                  title={
                    <Term title={"TXs"}>
                      {"The number of transactions since genesis. "}
                      <a
                        href={"https://docs.near.org/docs/concepts/transaction"}
                      >
                        docs
                      </a>
                    </Term>
                  }
                  imgLink="/static/images/icon-m-transaction.svg"
                  text={context.totalTransactions.toLocaleString()}
                  loading={!context.totalTransactions}
                />
              </Col>
              <Col xs="12" md="2">
                <CardCell
                  title={
                    <Term title={"TPD"}>
                      {"The number of transactions in the last 24 hours. "}
                      <a
                        href={"https://docs.near.org/docs/concepts/transaction"}
                      >
                        docs
                      </a>
                    </Term>
                  }
                  imgLink="/static/images/icon-m-transaction.svg"
                  text={context.lastDayTxCount.toLocaleString()}
                  loading={!context.lastDayTxCount}
                />
              </Col>
              <Col xs="12" md="2">
                <CardCell
                  title={
                    <Term title={"Accounts"}>
                      {"Total number of accounts created on this net. "}
                      <a href={"https://docs.near.org/docs/concepts/account"}>
                        docs
                      </a>
                    </Term>
                  }
                  imgLink="/static/images/icon-m-user.svg"
                  text={
                    <Link href="/accounts">
                      <a className="dashboard-link">
                        {context.totalAccounts.toLocaleString()}
                      </a>
                    </Link>
                  }
                  loading={!context.totalAccounts}
                />
              </Col>
            </Row>
          )}
        </DatabaseConsumer>
        <Row className="p-3 search-bar" noGutters>
          <Search dashboard />
        </Row>
        <style jsx global>{`
          .dashboard-info-container {
            border: solid 4px #e6e6e6;
            border-radius: 4px;
          }

          .dashboard-info-container > .row:first-of-type .card-cell-text {
            font-size: 24px;
          }

          .dashboard-link {
            text-decoration: none;
            color: #0072ce !important;
          }

          .search-bar {
            background: #f8f8f8;
            border-top: 2px solid #e6e6e6;
          }
        `}</style>
      </div>
    );
  }
}
