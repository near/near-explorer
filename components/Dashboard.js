import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import Content from "./Content";

import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardTransactions from "./dashboard/DashboardTransactions";
import DashboardBlocks from "./dashboard/DashboardBlocks";

const Dashboard = () => (
  <Content title="Dashboard">
    <DashboardHeader />
    <Row noGutters="true">
      <Col md="7">
        <DashboardTransactions />
      </Col>
      <Col md="1" />
      <Col md="4">
        <DashboardBlocks />
      </Col>
    </Row>
  </Content>
);

export default Dashboard;
