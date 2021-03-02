import Head from "next/head";
import { Nav } from "react-bootstrap";

import Mixpanel from "../../libraries/mixpanel";

import Content from "../../components/utils/Content";

import PartnerTotalTransactionList from "../../components/stats/PartnerTotalTransactionList";
import PartnerFirst3MonthTransactionslist from "../../components/stats/PartnerFirst3MonthTransactionsList";

export default class extends React.Component {
  render() {
    Mixpanel.track("View Partner page");
    return (
      <>
        <Head>
          <title>NEAR Explorer | Partner Project Stats</title>
        </Head>
        <Content title={<h1>Partner Project Stats</h1>}>
          <SideBar />
          <div id="partnerTotalTransactions">
            <PartnerTotalTransactionList />
          </div>
          <hr />
          <div id="partnerFirst3Month">
            <PartnerFirst3MonthTransactionslist />
          </div>
        </Content>
      </>
    );
  }
}

const SideBar = () => (
  <Nav className="stats-sidebar">
    <Nav.Link href="#partnerTotalTransactions">
      Partner Accounts Total Transactions
    </Nav.Link>
    <Nav.Link href="#partnerFirst3Month">
      Partner Accounts First 3 Month Transactions
    </Nav.Link>
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
