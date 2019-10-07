import { Row, Col } from "react-bootstrap";

import Content from "../utils/Content";
import EmptyRow from "../utils/EmptyRow";

import DashboardHeader from "./DashboardHeader";
import DashboardTransactions from "./DashboardTransactions";
import DashboardBlocks from "./DashboardBlocks";

const Dashboard = () => (
  <Content title="Dashboard" border={false}>
    <DashboardHeader />
    <Row noGutters="true">
      <Col md="8">
        <DashboardTransactions />
      </Col>
      <Col md="4">
        <DashboardBlocks />
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
