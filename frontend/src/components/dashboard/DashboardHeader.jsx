import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import CardCell from "../utils/CardCell";

export default ({
  onlineNodesCount,
  totalNodesCount,
  lastBlockHeight,
  transactionsPerSecond,
  lastDayTxCount,
  accountsCount
}) => (
  <div className="dashboard-info-container">
    <Row noGutters>
      <Col xs="12" md="3">
        <Link href="/nodes">
          <a>
            <CardCell
              title="Nodes Online"
              imgLink="/static/images/icon-m-node-online.svg"
              text={`${onlineNodesCount.toLocaleString()}/${totalNodesCount.toLocaleString()}`}
              className="border-0"
            />
          </a>
        </Link>
      </Col>
      <Col xs="12" md="3">
        <CardCell
          title="Block Height"
          imgLink="/static/images/icon-m-height.svg"
          text={lastBlockHeight.toLocaleString()}
        />
      </Col>
      <Col xs="12" md="2">
        <CardCell
          title="Tps"
          imgLink="/static/images/icon-m-tps.svg"
          text={transactionsPerSecond.toLocaleString()}
        />
      </Col>
      <Col xs="12" md="2">
        <CardCell
          title="Last Day Tx"
          imgLink="/static/images/icon-m-transaction.svg"
          text={lastDayTxCount.toLocaleString()}
        />
      </Col>
      <Col xs="12" md="2">
        <Link href="accounts">
          <a>
            <CardCell
              title="Accounts"
              imgLink="/static/images/icon-m-user.svg"
              text={accountsCount.toLocaleString()}
            />
          </a>
        </Link>
      </Col>
    </Row>
    <style jsx global>{`
      .dashboard-info-container {
        border: solid 4px #e6e6e6;
        border-radius: 4px;
      }

      .dashboard-info-container > .row:first-of-type .card-cell-text {
        font-size: 24px;
      }
    `}</style>
  </div>
);
