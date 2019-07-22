import Link from "next/link";

import { Row, Col, Card } from "react-bootstrap";

import hexstring from "../utils/hexstring";
import Timer from "../utils/Timer";

const DashboardBlocksBlock = props => (
  <Col xs="6">
    <Link href="/blocks/[hash]" as={`/blocks/${props.blockHash}`}>
      <a className="dashboard-blocks-block-link">
        <Card className="dashboard-blocks-block">
          <Card.Title className="dashboard-blocks-block-title">
            #{props.blockHeight}
          </Card.Title>
          <Card.Body className="dashboard-blocks-block-content">
            <p className="dashboard-blocks-block-content-p">
              <img src="/static/images/icon-m-transaction.svg" />
              {props.transactionsCount}
            </p>
            <p className="dashboard-blocks-block-content-p">
              <img src="/static/images/icon-m-height.svg" />
              {props.blockHeight}
            </p>
            <p className="dashboard-blocks-block-content-p">
              <img
                style={{ float: "left" }}
                src="/static/images/icon-m-user.svg"
              />
              <span className="d-none d-sm-block">@{props.blockAuthorId}</span>
              <span className="d-sm-none">
                @
                {props.blockAuthorId.length > 9
                  ? `${props.blockAuthorId.substring(0, 7)}..`
                  : props.blockAuthorId}
              </span>
            </p>
            <Row noGutters="true">
              <Col md="7" xs="7">
                <span className="dashboard-blocks-block-content-p-footer">
                  {props.blockHash.slice(0, 6)}...
                </span>
              </Col>
              <Col md="5" xs="5" className="align-self-center text-right">
                <span className="dashboard-blocks-block-timer">
                  <Timer
                    time={parseInt(props.blockTimestamp.substring(0, 13))}
                  />
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </a>
    </Link>
    <style jsx global>{`
      .dashboard-blocks-block-link {
        cursor: pointer;
      }

      .dashboard-blocks-block-link:hover {
        text-decoration: none;
      }

      .dashboard-blocks-block {
        padding: 10px;
        border-radius: 8px;
        border: solid 4px #e6e6e6;
        margin-top: 8px;
      }

      .dashboard-blocks-block-title {
        font-family: BentonSans;
        font-size: 18px;
        font-weight: 500;
        color: #24272a;
      }

      .dashboard-blocks-block-content {
        padding: 0 !important;
      }

      .dashboard-blocks-block-content-p {
        line-height: 8px;
        font-family: BentonSans;
        font-size: 14px;
        color: #999999;
      }

      .dashboard-blocks-block-content-p > img {
        width: 12px;
        margin-right: 5px;
        margin-top: -4px;
      }

      .dashboard-blocks-block-content-p-footer {
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
        color: #0072ce;
        margin-bottom: 0;
      }

      .dashboard-blocks-block-timer {
        font-family: BentonSans;
        font-size: 12px;
        color: #999999;
      }
    `}</style>
  </Col>
);

export default DashboardBlocksBlock;
