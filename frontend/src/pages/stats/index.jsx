import Head from "next/head";

import Content from "../../components/utils/Content";

import TransactionsByDate from "../../components/stats/TransactionsByDate";
import GasUsedByDate from "../../components/stats/GasUsedByDate";
import NewAccountsByDate from "../../components/stats/NewAccountsByDate";
import NewContractsByDate from "../../components/stats/NewContractsByDate";
import ActiveAccountsByDate from "../../components/stats/ActiveAccountsByDate";
import ActiveContractsByDate from "../../components/stats/ActiveContractsByDate";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Stats</title>
        </Head>
        <Content title={<h1>Stats</h1>}>
          <TransactionsByDate />
          <GasUsedByDate />
          <NewAccountsByDate />
          <NewContractsByDate />
          <ActiveAccountsByDate />
          <ActiveContractsByDate />
        </Content>
      </>
    );
  }
}
