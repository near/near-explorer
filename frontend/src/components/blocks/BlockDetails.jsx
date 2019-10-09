import moment from "moment";
import { Row, Col } from "react-bootstrap";

import BlockCard from "./BlockCard";

export default ({ block }) => {
  return (
    <>
      <Row noGutters="true">
        <Col className="block-info-container">
          <Row noGutters="true">
            <Col md="3">
              <BlockCard
                title="Transactions"
                imgLink="/static/images/icon-m-transaction.svg"
                text={block.transactionsCount}
                cls="block-card-no-side-border block-card-no-top-border"
              />
            </Col>
            <Col md="2">
              <BlockCard
                title="Size"
                imgLink="/static/images/icon-m-size.svg"
                text="TODO"
                cls="block-card-no-top-border"
              />
            </Col>
          </Row>
          <Row noGutters="true">
            <Col md="4">
              <BlockCard
                title="Created"
                text={moment(block.timestamp).format(
                  "MMMM DD, YYYY [at] h:mm:ssa"
                )}
                textCls="block-card-created-text"
                cls="block-card-no-border"
              />
            </Col>
            <Col md="8">
              <BlockCard
                title="Hash"
                text={block.hash}
                textCls="block-card-created-text"
                cls="block-card-no-border"
              />
            </Col>
          </Row>
          <Row noGutters="true">
            <Col md="12">
              <BlockCard
                title="Parent Hash"
                text={block.prevHash}
                textCls="block-card-parent-hash-text"
                textLink={true}
                cls="block-card-parent-hash block-card-no-border"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <style jsx global>{`
        .block-card-created-text {
          font-size: 18px;
          font-weight: 500;
          color: #4a4f54;
        }

        .block-card-author-text {
          color: #0072ce;
        }

        .block-card-parent-hash-text {
          font-size: 18px;
          font-weight: 500;
          color: #6ad1e3;
          cursor: pointer;
          text-decoration: none !important;
        }

        .block-card-parent-hash-text:hover {
          color: #6ad1e3;
        }

        .block-card-parent-hash {
          background-color: #f8f8f8;
        }

        .block-card-no-border {
          border: 0 !important;
        }

        .block-card-no-side-border {
          border-left: 0 !important;
          border-right: 0 !important;
        }

        .block-card-no-top-border {
          border-top: 0 !important;
        }

        .block-card-no-bottom-border {
          border-bottom: 0 !important;
        }

        .block-info-container {
          border: solid 4px #e6e6e6;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};
