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
    <Row>
      <Col md="8">
        <DashboardTransactions />
      </Col>
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
