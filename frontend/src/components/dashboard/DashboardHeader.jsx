import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import DashboardCard from "./DashboardCard";

export default ({
  onlineNodesCount,
  totalNodesCount,
  lastBlockHeight,
  transactionsPerSecond,
  lastDayTxCount,
  accountsCount
}) => (
  <Row noGutters="true">
    <Col xs="12" md="3">
      <Link href="/nodes">
        <a>
          <DashboardCard
            title="Nodes Online"
            imgLink="/static/images/icon-m-node-online.svg"
            text={`${onlineNodesCount}/${totalNodesCount}`}
          />
        </a>
      </Link>
    </Col>
    <Col xs="12" md="3">
      <DashboardCard
        title="Block Height"
        imgLink="/static/images/icon-m-height.svg"
        text={`${lastBlockHeight}`}
        format="true"
      />
    </Col>
    <Col xs="12" md="2">
      <DashboardCard
        title="Tps"
        imgLink="/static/images/icon-m-tps.svg"
        text={transactionsPerSecond}
      />
    </Col>
    <Col xs="12" md="2">
      <DashboardCard
        title="Last Day Tx"
        imgLink="/static/images/icon-m-transaction.svg"
        text={`${lastDayTxCount}`}
        format="true"
      />
    </Col>
    <Col xs="12" md="2">
      <Link href="accounts">
        <a>
          <DashboardCard
            title="Accounts"
            imgLink="/static/images/icon-m-user.svg"
            text={`${accountsCount}`}
            format="true"
          />
        </a>
      </Link>
    </Col>
  </Row>
);
