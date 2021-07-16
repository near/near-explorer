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

import { Translate } from "react-localize-redux";

export interface Props {
  block: B.DetailedBlockInfo;
}

const BlockDetails = ({ block }: Props) => {
  return (
    <Translate>
      {({ translate }) => (
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
                            title={translate(
                              "component.blocks.BlockDetails.transactions.title"
                            )}
                            text={translate(
                              "component.blocks.BlockDetails.transactions.text"
                            )}
                            href={
                              "https://docs.near.org/docs/concepts/transaction"
                            }
                          />
                        }
                        imgLink="/static/images/icon-m-transaction.svg"
                        text={block.transactionsCount.toLocaleString()}
                        className="border-0"
                      />
                    </Col>
                    <Col md="4">
                      <CardCell
                        title={translate(
                          "component.blocks.BlockDetails.receipts.title"
                        ).toString()}
                        text={block.receiptsCount.toString()}
                      />
                    </Col>
                    <Col md="4">
                      <CardCell
                        title={
                          <Term
                            title={translate(
                              "component.blocks.BlockDetails.status.title"
                            )}
                            text={translate(
                              "component.blocks.BlockDetails.status.text"
                            )}
                            href={
                              "https://docs.near.org/docs/develop/front-end/rpc#block"
                            }
                          />
                        }
                        imgLink="/static/images/icon-t-status.svg"
                        text={
                          typeof context.finalityStatus
                            ?.finalBlockTimestampNanosecond === "undefined"
                            ? translate(
                                "common.blocks.status.checking_finality"
                              ).toString()
                            : new BN(block.timestamp).lte(
                                context.finalityStatus.finalBlockTimestampNanosecond.divn(
                                  10 ** 6
                                )
                              )
                            ? translate(
                                "common.blocks.status.finalized"
                              ).toString()
                            : translate(
                                "common.blocks.status.finalizing"
                              ).toString()
                        }
                      />
                    </Col>
                  </Row>
                  <Row noGutters>
                    <Col md="4">
                      <CardCell
                        title={translate(
                          "component.blocks.BlockDetails.author.title"
                        ).toString()}
                        text={<AccountLink accountId={block.authorAccountId} />}
                        className="border-0"
                      />
                    </Col>
                    <Col md="4">
                      <CardCell
                        title={
                          <Term
                            title={translate(
                              "component.blocks.BlockDetails.gas_used.title"
                            )}
                            text={translate(
                              "component.blocks.BlockDetails.gas_used.text"
                            )}
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
                            title={translate(
                              "component.blocks.BlockDetails.gas_price.title"
                            )}
                            text={translate(
                              "component.blocks.BlockDetails.gas_price.text"
                            )}
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
                            title={translate(
                              "component.blocks.BlockDetails.created.title"
                            )}
                            text={translate(
                              "component.blocks.BlockDetails.created.text"
                            )}
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
                            title={translate(
                              "component.blocks.BlockDetails.hash.title"
                            )}
                            text={translate(
                              "component.blocks.BlockDetails.hash.text"
                            )}
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
                            title={translate(
                              "component.blocks.BlockDetails.parent_hash.title"
                            )}
                            text={translate(
                              "component.blocks.BlockDetails.parent_hash.text"
                            )}
                          />
                        }
                        text={
                          block.prevHash ===
                          "11111111111111111111111111111111" ? (
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
      )}
    </Translate>
  );
};

export default BlockDetails;
