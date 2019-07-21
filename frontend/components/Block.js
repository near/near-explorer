import Link from "next/link";

import moment from "moment";
import { Row, Col, Card } from "react-bootstrap";

import Content from "./Content";
import EmptyRow from "./utils/EmptyRow";

const BlockCard = props => (
  <Card
    className={props.cls}
    style={{ border: "solid 4px #e6e6e6", borderRadius: "0" }}
  >
    <Card.Body>
      <Row noGutters="true">
        <Col xs="auto" md="12" className="block-card-title align-self-center">
          {props.imgLink !== undefined ? (
            <img src={props.imgLink} className="block-card-title-img" />
          ) : null}
          {props.title}
        </Col>
        <Col
          xs="auto"
          md="12"
          className={`ml-auto block-card-text align-self-center ${
            props.textCls !== undefined ? props.textCls : ""
          }`}
        >
          {props.textLink === true ? (
            <Link href={`/blocks/${props.text}`}>
              <a className={props.textCls}>
                {props.format !== undefined
                  ? parseInt(props.text).toLocaleString()
                  : props.text}
              </a>
            </Link>
          ) : props.format !== undefined ? (
            parseInt(props.text).toLocaleString()
          ) : (
            props.text
          )}
        </Col>
      </Row>
    </Card.Body>
    <style jsx global>{`
      .block-card-title {
        text-transform: uppercase;
        letter-spacing: 1.8px;
        color: #999999;
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
      }

      .block-card-title-img {
        width: 12px !important;
        margin-right: 8px;
        margin-top: -3px;
      }

      .block-card-text {
        font-family: BwSeidoRound;
        font-size: 24px;
        font-weight: 500;
        color: #24272a;
      }
    `}</style>
  </Card>
);

const Block = ({ block }) => {
  return (
    <Content title={`Block #${block.height}`} border={false}>
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
            <Col md="7">
              <BlockCard
                title="Author"
                imgLink="/static/images/icon-m-user.svg"
                text={`@${block.authorId}`}
                cls="block-card-no-side-border block-card-no-top-border"
                textCls="block-card-author-text"
              />
            </Col>
          </Row>
          <Row noGutters="true">
            <Col md="4">
              <BlockCard
                title="Created"
                text={moment(parseInt(block.timestamp.substring(0, 13))).format(
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
                text={block.hash}
                textCls="block-card-parent-hash-text"
                textLink={true}
                cls="block-card-parent-hash block-card-no-border"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <EmptyRow rows="5" />
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
    </Content>
  );
};

export default Block;
