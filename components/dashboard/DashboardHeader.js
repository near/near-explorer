import Link from "next/link";

import { Row, Col, Card } from "react-bootstrap";

import { DataConsumer } from "../utils/DataProvider";

const DashboardCard = props => (
  <Card
    className={`text-center ${props.cls}`}
    style={{ border: "solid 4px #e6e6e6" }}
  >
    <Card.Body>
      <Card.Title className="dashboard-card-title">
        <img src={props.imgLink} className="dashboard-card-title-img" />
        {props.title}
      </Card.Title>
      <Card.Text className="dashboard-card-text">
        {props.format !== undefined
          ? parseInt(props.text).toLocaleString()
          : props.text}
      </Card.Text>
    </Card.Body>
    <style jsx global>{`
      .dashboard-card-title {
        text-transform: uppercase;
        letter-spacing: 1.8px;
        color: #999999;
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
      }

      .dashboard-card-title-img {
        width: 12px !important;
        margin-right: 8px;
      }

      .dashboard-card-text {
        font-family: BwSeidoRound;
        font-size: 24px;
        font-weight: 500;
        color: #24272a;
        margin-top: -10px;
      }
    `}</style>
  </Card>
);

const DashboardHeader = () => (
  <DataConsumer>
    {context => (
      <Row noGutters="true">
        <Col xs="12" md="3">
          <DashboardCard
            title="Nodes Online"
            imgLink="/static/images/icon-m-node-online.svg"
            text={`${context.details.nodesOnline}/${
              context.details.totalNodes
            }`}
          />
        </Col>
        <Col xs="12" md="3">
          <DashboardCard
            title="Block Height"
            imgLink="/static/images/icon-m-height.svg"
            text={`${context.details.blockHeight}`}
            format="true"
          />
        </Col>
        <Col xs="12" md="2">
          <DashboardCard
            title="Tps/Max"
            imgLink="/static/images/icon-m-tps.svg"
            text={`${context.details.tpsMax}`}
          />
        </Col>
        <Col xs="12" md="2">
          <DashboardCard
            title="Last Day Tx"
            imgLink="/static/images/icon-m-transaction.svg"
            text={`${context.details.lastDayTx}`}
            format="true"
          />
        </Col>
        <Col xs="12" md="2">
          <Link href="accounts">
            <a>
              <DashboardCard
                title="Accounts"
                imgLink="/static/images/icon-m-user.svg"
                text={`${context.details.accounts}`}
                format="true"
              />
            </a>
          </Link>
        </Col>
      </Row>
    )}
  </DataConsumer>
);

export default DashboardHeader;
