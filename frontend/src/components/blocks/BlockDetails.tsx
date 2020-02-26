import moment from "moment";

import { Row, Col } from "react-bootstrap";

import * as B from "../../libraries/explorer-wamp/blocks";

import BlockLink from "../utils/BlockLink";
import CardCell from "../utils/CardCell";

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
                title="Transactions"
                imgLink="/static/images/icon-m-transaction.svg"
                text={block.transactionsCount.toLocaleString()}
                className="border-0"
              />
            </Col>
            <Col md="2">
              <CardCell
                title="Size"
                imgLink="/static/images/icon-m-size.svg"
                text="TODO"
              />
            </Col>
          </Row>
          <Row noGutters className="border-0">
            <Col md="4">
              <CardCell
                title="Created"
                text={moment(block.timestamp).format(
                  "MMMM DD, YYYY [at] h:mm:ssa"
                )}
                className="block-card-created border-0"
              />
            </Col>
            <Col md="8">
              <CardCell title="Hash" text={block.hash} className="border-0" />
            </Col>
          </Row>
          <Row noGutters>
            <Col md="12">
              <CardCell
                title="Parent Hash"
                text={
                  <BlockLink blockHash={block.prevHash}>
                    {block.prevHash}
                  </BlockLink>
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
