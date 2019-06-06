import Link from "next/link";

import { Container, Row, Col, Card, CardGroup } from "react-bootstrap";

import Content from "./Content";

const DashboardCard = props => (
  <Card className="text-center" style={{ border: "solid 4px #e6e6e6" }}>
    <Card.Body>
      <Card.Title className="dashboard-card-title">
        <img src={props.imgLink} className="dashboard-card-title-img" />
        {props.title}
      </Card.Title>
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
    `}</style>
  </Card>
);

const Dashboard = () => (
  <Content title="Dashboard">
    <Row>
      <Col>
        <CardGroup>
          <DashboardCard
            title="Nodes Online"
            imgLink="/static/images/icon-m-node-online.svg"
          />
          <DashboardCard
            title="Block Height"
            imgLink="/static/images/icon-m-height.svg"
          />
          <DashboardCard
            title="Tps/Max"
            imgLink="/static/images/icon-m-tps.svg"
          />
          <DashboardCard
            title="Last Day Tx"
            imgLink="/static/images/icon-m-transaction.svg"
          />
          <DashboardCard
            title="Accounts"
            imgLink="/static/images/icon-m-user.svg"
          />
        </CardGroup>
      </Col>
    </Row>
  </Content>
);

export default Dashboard;
