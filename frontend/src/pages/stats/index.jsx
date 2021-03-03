import Head from "next/head";
import { Nav, Dropdown, Row, Col } from "react-bootstrap";

import NodeProvider, { NodeConsumer } from "../../context/NodeProvider";

import Content from "../../components/utils/Content";

import TransactionsByDate from "../../components/stats/TransactionsByDate";
import GasUsedByDate from "../../components/stats/GasUsedByDate";
import NewAccountsByDate from "../../components/stats/NewAccountsByDate";
import NewContractsByDate from "../../components/stats/NewContractsByDate";
import ActiveAccountsByDate from "../../components/stats/ActiveAccountsByDate";
import ActiveContractsByDate from "../../components/stats/ActiveContractsByDate";
import ActiveAccountsList from "../../components/stats/ActiveAccountsList";
import ActiveContractsList from "../../components/stats/ActiveContractsList";
import StakingBar from "../../components/stats/StakingBar";

export default class extends React.PureComponent {
  render() {
    const chartStyle = {
      height: "480px",
      width: "100%",
      marginTop: "26px",
      marginLeft: "24px",
    };
    return (
      <>
        <Head>
          <title>NEAR Explorer | Stats</title>
        </Head>
        <Content title={<h1>Stats</h1>}>
          <Sidebar />
          <div id="transactionsByDate">
            <TransactionsByDate chartStyle={chartStyle} />
          </div>
          <hr />
          <div id="gasUsedByDate">
            <GasUsedByDate chartStyle={chartStyle} />
          </div>
          <hr />
          <div id="newAccountsByDate">
            <NewAccountsByDate chartStyle={chartStyle} />
          </div>
          <hr />
          <div id="newContractsByDate">
            <NewContractsByDate chartStyle={chartStyle} />
          </div>
          <hr />
          <div id="activeAccountsBydate">
            <ActiveAccountsByDate chartStyle={chartStyle} />
          </div>
          <hr />
          <div id="activeContractsByDate">
            <ActiveContractsByDate chartStyle={chartStyle} />
          </div>
          <hr />
          <div id="activeAccountsList">
            <ActiveAccountsList chartStyle={chartStyle} />
          </div>
          <hr />
          <div id="activeContractsList">
            <ActiveContractsList chartStyle={chartStyle} />
          </div>
          <hr />
          <div id="validators">
            <NodeProvider>
              <NodeConsumer>
                {(context) =>
                  typeof context.validators !== "undefined" ? (
                    <StakingBar validators={context.validators} />
                  ) : null
                }
              </NodeConsumer>
            </NodeProvider>
          </div>
        </Content>
      </>
    );
  }
}

const SideBarContent = () => {
  return (
    <Nav className="stats-sidebar">
      <Nav.Link href="#transactionsByDate">Transactions Amount</Nav.Link>
      <Nav.Link href="#gasUsedByDate">Used Tera Gas</Nav.Link>
      <Nav.Link href="#newAccountsByDate">New Accounts</Nav.Link>
      <Nav.Link href="#newContractsByDate">New Contracts</Nav.Link>
      <Nav.Link href="#activeAccountsBydate">Active Accounts</Nav.Link>
      <Nav.Link href="#activeContractsByDate">Active Contracts</Nav.Link>
      <Nav.Link href="#activeAccountsList">Top 10 of Active Accounts</Nav.Link>
      <Nav.Link href="#activeContractsList">
        Top 10 of Active Contracts
      </Nav.Link>
      <Nav.Link href="#validators">Staking Pool</Nav.Link>
      <style jsx global>{`
        .stats-sidebar {
          width: 100%;
        }
        .stats-sidebar .nav-link {
          color: #042772;
          display: block;
          width: 100%;
        }
      `}</style>
    </Nav>
  );
};

const MobileSideBar = () => (
  <Dropdown>
    <Dropdown.Toggle variant="success" id="dropdown-basic">
      <img className="sidebar-icon" src={"/static/images/icon-sidebar.svg"} />
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <SideBarContent />
    </Dropdown.Menu>

    <style jsx global>{`
      .sidebar-icon {
        height: 16px;
        width: 16px;
      }
    `}</style>
  </Dropdown>
);

const Sidebar = () => (
  <Row className="sidebar">
    <Col lg="12" className="d-none d-lg-block">
      <SideBarContent />
    </Col>
    <Col xs="12" className="d-lg-none text-left">
      <MobileSideBar />
    </Col>
    <style jsx global>{`
      .sidebar {
        position: fixed;
        left: 5%;
        z-index: 10;
        top: 50%;
        width: 80%;
        max-width: 300px;
      }
    `}</style>
  </Row>
);
