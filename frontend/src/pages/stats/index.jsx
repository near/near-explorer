import Head from "next/head";

import Content from "../../components/utils/Content";

import TransactionsByDate from "../../components/stats/TransactionsByDate";
import GasUsed from "../../components/stats/GasUsed";
import NewAccountsByDate from "../../components/stats/NewAccountsByDate";
import NewContractsByDate from "../../components/stats/NewContractsByDate";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Stats</title>
        </Head>
        <Content title={<h1>Stats</h1>}>
          <NewAccountsByDate />
          <NewContractsByDate />
          <GasUsed />
          <TransactionsByDate />
        </Content>
      </>
    );
  }
}
