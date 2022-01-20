import BN from "bn.js";

import { FC } from "react";

import { Row, Col } from "react-bootstrap";

import * as B from "../../libraries/explorer-wamp/blocks";
import { DatabaseConsumer } from "../../context/DatabaseProvider";

import Timer from "../utils/Timer";
import Link from "../utils/Link";

import { useTranslation } from "react-i18next";

export interface Props {
  block: B.Block;
  cls?: string;
}

const BlocksRow: FC<Props> = ({ block, cls }) => {
  const { t } = useTranslation();
  return (
    <DatabaseConsumer>
      {(context) => (
        <Link href="/blocks/[hash]" as={`/blocks/${block.hash}`}>
          <a style={{ textDecoration: "none" }}>
            <Row
              className={`transaction-row mx-0 ${cls === undefined ? "" : cls}`}
            >
              <Col md="auto" xs="1" className="pr-0">
                <img src="/static/images/icon-m-block.svg" />
              </Col>
              <Col md="auto" xs="1" className="pr-0">
                <img
                  src="/static/images/icon-m-block.svg"
                  style={{ width: "20px" }}
                />
              </Col>
              <Col md="7" xs="6">
                <Row>
                  <Col className="transaction-row-title">#{block.height}</Col>
                </Row>
                <Row>
                  <Col className="transaction-row-text">
                    <Row>
                      <Col md="auto">
                        <img
                          src="/static/images/icon-m-transaction.svg"
                          style={{ width: "12px" }}
                        />
                        {` ${block.transactionsCount}`}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col md="3" xs="4" className="ml-auto text-right">
                <Row>
                  <Col className="transaction-row-txid">
                    {block.hash !== undefined
                      ? `${block.hash.substring(0, 7)}...`
                      : null}
                  </Col>
                </Row>
                <Row>
                  <Col className="transaction-row-timer">
                    <span className="transaction-row-timer-status">
                      {typeof context.finalityStatus
                        ?.finalBlockTimestampNanosecond === "undefined"
                        ? t("common.blocks.status.checking_finality")
                        : new BN(block.timestamp).lte(
                            context.finalityStatus.finalBlockTimestampNanosecond.divn(
                              10 ** 6
                            )
                          )
                        ? t("common.blocks.status.finalized")
                        : t("common.blocks.status.finalizing")}
                    </span>
                    &nbsp;&nbsp;
                    <Timer time={block.timestamp} />
                  </Col>
                </Row>
              </Col>
              <style jsx global>{`
                .transaction-row {
                  padding-top: 10px;
                  padding-bottom: 10px;
                  border-top: solid 2px #f8f8f8;
                }

                .transaction-row:hover {
                  background: rgba(0, 0, 0, 0.1);
                }

                .transaction-row-title {
                  font-size: 14px;
                  font-weight: 500;
                  line-height: 1.29;
                  color: #24272a;
                }

                .transaction-row-text {
                  font-size: 12px;
                  font-weight: 500;
                  line-height: 1.5;
                  color: #999999;
                }

                .transaction-row-txid {
                  font-size: 14px;
                  font-weight: 500;
                  line-height: 1.29;
                  color: #0072ce;
                }

                .transaction-row-timer {
                  font-size: 12px;
                  color: #999999;
                  font-weight: 100;
                }

                .transaction-row-timer-status {
                  font-weight: 500;
                }
              `}</style>
            </Row>
          </a>
        </Link>
      )}
    </DatabaseConsumer>
  );
};

export default BlocksRow;
