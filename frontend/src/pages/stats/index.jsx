import Head from "next/head";
import { Nav } from "react-bootstrap";

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
    return (
      <>
        <Head>
          <title>NEAR Explorer | Stats</title>
        </Head>
        <Content title={<h1>Stats</h1>}>
          <SideBar />
          <div id="transactionsByDate">
            <TransactionsByDate />
          </div>
          <hr />
          <div id="gasUsedByDate">
            <GasUsedByDate />
          </div>
          <hr />
          <div id="newAccountsByDate">
            <NewAccountsByDate />
          </div>
          <hr />
          <div id="newContractsByDate">
            <NewContractsByDate />
          </div>
          <hr />
          <div id="activeAccountsBydate">
            <ActiveAccountsByDate />
          </div>
          <hr />
          <div id="activeContractsByDate">
            <ActiveContractsByDate />
          </div>
          <hr />
          <div id="activeAccountsList">
            <ActiveAccountsList />
          </div>
          <hr />
          <div id="activeContractsList">
            <ActiveContractsList />
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

const SideBar = () => (
  <Nav className="stats-sidebar">
    <Nav.Link href="#transactionsByDate">Transactions Amount</Nav.Link>
    <Nav.Link href="#gasUsedByDate">Used Tera Gas</Nav.Link>
    <Nav.Link href="#newAccountsByDate">New Accounts</Nav.Link>
    <Nav.Link href="#newContractsByDate">New Contracts</Nav.Link>
    <Nav.Link href="#activeAccountsBydate">Active Accounts</Nav.Link>
    <Nav.Link href="#activeContractsByDate">Active Contracts</Nav.Link>
    <Nav.Link href="#activeAccountsList">Top 10 of Active Accounts</Nav.Link>
    <Nav.Link href="#activeContractsList">Top 10 of Active Contracts</Nav.Link>
    <Nav.Link href="#validators">Staking Pool</Nav.Link>
    <style jsx global>{`
      .stats-sidebar {
        width: 300px;
        position: fixed;
        left: 100px;
      }
      .stats-sidebar .nav-link {
        color: #042772;
        display: block;
        width: 100%;
      }
    `}</style>
  </Nav>
);
