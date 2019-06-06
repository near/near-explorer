import Link from "next/link";

import { Container, Row, Col, Card, CardGroup } from "react-bootstrap";

import Content from "./Content";

const DashboardCard = props => (
  <Card className="text-center" style={{ borderWidth: "4px" }}>
    <Card.Body>
      <Card.Title className="dashboard-card-title">
        <img src={props.imgLink} className="dashboard-card-title-img" />
        {props.title}
      </Card.Title>
    </Card.Body>
    <style jsx global>{`
      .dashboard-card-title {
        text-transform: uppercase;
        font-size: 15px;
        color: rgba(0, 0, 0, 0.4);
        letter-spacing: 1.5px;
        font-weight: 700;
      }

      .dashboard-card-title-img {
        width: 12px !important;
        margin-right: 10px;
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
            imgLink="/static/icon-m-node-online.svg"
          />
          <DashboardCard
            title="Block Height"
            imgLink="/static/icon-m-height.svg"
          />
          <DashboardCard title="Tps/Max" imgLink="/static/icon-m-tps.svg" />
          <DashboardCard
            title="Last Day Tx"
            imgLink="/static/icon-m-transaction.svg"
          />
          <DashboardCard title="Accounts" imgLink="/static/icon-m-user.svg" />
        </CardGroup>
      </Col>
    </Row>
  </Content>
);

export default Dashboard;
