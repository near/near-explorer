import moment from "moment";
import BN from "bn.js";

import { Row, Col } from "react-bootstrap";

import * as B from "../../libraries/explorer-wamp/blocks";
import { DatabaseConsumer } from "../../context/DatabaseProvider";

import AccountLink from "../utils/AccountLink";
import BlockLink from "../utils/BlockLink";
import CardCell from "../utils/CardCell";
import Term from "../utils/Term";
import Gas from "../utils/Gas";
import GasPrice from "../utils/GasPrice";

export interface Props {
  block: B.DetailedBlockInfo;
}

const BlockDetails = ({ block }: Props) => {
  return (
    <DatabaseConsumer>
      {(context) => (
        <>
          <Row noGutters>
            <Col className="block-info-container">
              <Row noGutters className="block-info-header">
                <Col md="4">
                  <CardCell
                    title={
                      <Term
                        title={"Transactions"}
                        text={"Number of transactions in this block. "}
                        href={"https://docs.near.org/docs/concepts/transaction"}
                      />
                    }
                    imgLink="/static/images/icon-m-transaction.svg"
                    text={block.transactionsCount.toLocaleString()}
                    className="border-0"
                  />
                </Col>
                <Col md="4">
                  <CardCell
                    title={"Receipts"}
                    text={block.receiptsCount.toString()}
                  />
                </Col>
                <Col md="4">
                  <CardCell
                    title={
                      <Term
                        title={"Status"}
                        text={
                          "Current status of the block (finalizing or finalized). "
                        }
                        href={
                          "https://docs.near.org/docs/develop/front-end/rpc#block"
                        }
                      />
                    }
                    imgLink="/static/images/icon-t-status.svg"
                    text={
                      typeof context.finalityStatus
                        ?.finalBlockTimestampNanosecond === "undefined"
                        ? "Checking Finality..."
                        : new BN(block.timestamp).lte(
                            context.finalityStatus.finalBlockTimestampNanosecond.divn(
                              10 ** 6
                            )
                          )
                        ? "Finalized"
                        : "Finalizing"
                    }
                  />
                </Col>
              </Row>
              <Row noGutters>
                <Col md="4">
                  <CardCell
                    title={"Author"}
                    text={<AccountLink accountId={block.authorAccountId} />}
                    className="border-0"
                  />
                </Col>
                <Col md="4">
                  <CardCell
                    title={
                      <Term
                        title={"Gas Used"}
                        text={
                          "Total units of gas used by transactions in this block. "
                        }
                        href={"https://docs.near.org/docs/concepts/gas"}
                      />
                    }
                    imgLink="/static/images/icon-m-size.svg"
                    text={<Gas gas={block.gasUsed} />}
                  />
                </Col>
                <Col md="4">
                  <CardCell
                    title={
                      <Term
                        title={"Gas Price"}
                        text={
                          "A unit of Tgas (TeraGas) is 1*10^12 units of gas. The costs of gas are very low in terms of NEAR, which is why Tgas is more commonly used. "
                        }
                        href={"https://docs.near.org/docs/concepts/gas"}
                      />
                    }
                    imgLink="/static/images/icon-m-filter.svg"
                    text={<GasPrice gasPrice={block.gasPrice} />}
                  />
                </Col>
              </Row>
              <Row noGutters>
                <Col md="4">
                  <CardCell
                    title={
                      <Term
                        title={"Created"}
                        text={"Timestamp of when this block finalized. "}
                      />
                    }
                    text={moment(block.timestamp).format(
                      "MMMM DD, YYYY [at] h:mm:ssa"
                    )}
                    className="block-card-created border-0"
                  />
                </Col>
                <Col md="8">
                  <CardCell
                    title={
                      <Term
                        title={"Hash"}
                        text={"Unique identifier (hash) of this block. "}
                      />
                    }
                    text={block.hash}
                  />
                </Col>
              </Row>
              <Row noGutters>
                <Col md="12">
                  <CardCell
                    title={
                      <Term
                        title={"Parent Hash"}
                        text={"Unique identifier (hash) of previous block. "}
                      />
                    }
                    text={
                      block.prevHash === "11111111111111111111111111111111" ? (
                        "Genesis"
                      ) : (
                        <BlockLink blockHash={block.prevHash}>
                          {block.prevHash}
                        </BlockLink>
                      )
                    }
                    className="block-card-parent-hash border-0"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <style jsx global>{`
            .block-info-container {
              border: solid 4px #e6e6e6;
              border-radius: 4px;
            }

            .block-info-container > .row {
              border-bottom: 2px solid #e6e6e6;
            }

            .block-info-container > .row:last-of-type {
              border-bottom: 0;
            }

            .block-info-header .card-cell-text {
              font-size: 24px;
            }

            .block-card-created-text {
              font-size: 18px;
              font-weight: 500;
              color: #4a4f54;
            }

            .block-card-parent-hash {
              background-color: #f8f8f8;
            }

            @media (max-width: 768px) {
              .block-info-container .card-cell {
                border-left: 0;
              }
            }
          `}</style>
        </>
      )}
    </DatabaseConsumer>
  );
};

export default BlockDetails;
