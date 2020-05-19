import moment from "moment";

import { Row, Col } from "react-bootstrap";

import * as B from "../../libraries/explorer-wamp/blocks";

import BlockLink from "../utils/BlockLink";
import CardCell from "../utils/CardCell";
import Term from "../utils/Term";

export interface Props {
  block: B.BlockInfo;
}

export default ({ block }: Props) => {
  return (
    <>
      <Row noGutters>
        <Col className="block-info-container">
          <Row noGutters className="block-info-header">
            <Col md="3">
              <CardCell
                title={
                  <Term title={"Transactions"}>
                    {"Number of transactions in this block. "}
                    <a
                      href={
                        "https://docs.nearprotocol.com/docs/concepts/transaction"
                      }
                    >
                      docs
                    </a>
                  </Term>
                }
                imgLink="/static/images/icon-m-transaction.svg"
                text={block.transactionsCount.toLocaleString()}
                className="border-0"
              />
            </Col>
            <Col md="3">
              <CardCell
                title={
                  <Term title={"Gas Used"}>
                    {"Total units of gas used by transactions in this block. "}
                    <a href={"https://docs.nearprotocol.com/docs/concepts/gas"}>
                      docs
                    </a>
                  </Term>
                }
                imgLink="/static/images/icon-m-size.svg"
                text={block.gasUsed.toLocaleString()}
              />
            </Col>
            <Col md="3">
              <CardCell
                title={
                  <Term title={"Gas Price"}>
                    {"Cost per unit of gas. "}
                    <a href={"https://docs.nearprotocol.com/docs/concepts/gas"}>
                      docs
                    </a>
                  </Term>
                }
                imgLink="/static/images/icon-m-filter.svg"
                text={block.gasPrice.toLocaleString()}
              />
            </Col>
            <Col md="3">
              <CardCell
                title={
                  <Term title={"Status"}>
                    {
                      "Current status of the block (finalizing or non-finalizing). "
                    }
                    <a
                      href={"https://docs.near.org/docs/interaction/rpc#block"}
                    >
                      docs
                    </a>
                  </Term>
                }
                imgLink="/static/images/icon-t-status.svg"
                text={block.isFinal ? "Finalized" : "Finalizing"}
              />
            </Col>
          </Row>
          <Row noGutters className="border-0">
            <Col md="4">
              <CardCell
                title={
                  <Term title={"Created"}>
                    {"Timestamp of when this block finalized. "}
                  </Term>
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
                  <Term title={"Hash"}>
                    {"Unique identifier (hash) of this block. "}
                  </Term>
                }
                text={block.hash}
                className="border-0"
              />
            </Col>
          </Row>
          <Row noGutters>
            <Col md="12">
              <CardCell
                title={
                  <Term title={"Parent Hash"}>
                    {"Unique identifier (hash) of previous block. "}
                  </Term>
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
      `}</style>
    </>
  );
};
