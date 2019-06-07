import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import Content from "./Content";

import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardTransactions from "./dashboard/DashboardTransactions";

const Dashboard = () => (
  <Content title="Dashboard">
    <DashboardHeader />
    <Row>
      <Col md="7">
        <DashboardTransactions />
      </Col>
    </Row>
  </Content>
);

export default Dashboard;
