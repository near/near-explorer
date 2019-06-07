import Link from "next/link";

import { Row, Col } from "react-bootstrap";

import Content from "./Content";

import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardTransactions from "./dashboard/DashboardTransactions";
import DashboardBlocks from "./dashboard/DashboardBlocks";

const EmptyRow = () => (
  <Row>
    <Col>&nbsp;</Col>
  </Row>
);

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
    <Row noGutters="true">
      <Col md="auto">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Col>
      <Col md="8">
        <Link href="transactions">
          <a className="dashboard-footer">View All</a>
        </Link>
      </Col>
    </Row>
    <EmptyRow />
    <EmptyRow />
    <EmptyRow />
    <style jsx global>{`
      .dashboard-footer {
        width: 100px;
        border-radius: 30px;
        background-color: #f8f8f8;
        display: block;
        padding: 8px 0;
        text-align: center;
        text-decoration: none;
        font-family: BentonSans;
        font-size: 14px;
        color: #0072ce;
        font-weight: bold;
        text-transform: uppercase;
      }

      .dashboard-footer:hover {
        text-decoration: none;
      }

      a {
        text-decoration: none;
      }

      a:hover {
        text-decoration: none;
      }
    `}</style>
  </Content>
);

export default Dashboard;
