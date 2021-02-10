import Head from "next/head";

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
          <ActiveAccountsList />
          <ActiveContractsByDate />
          <ActiveContractsList />
          <NodeProvider>
            <NodeConsumer>
              {(context) =>
                typeof context.validators !== "undefined" ? (
                  <StakingBar validators={context.validators} />
                ) : null
              }
            </NodeConsumer>
          </NodeProvider>
        </Content>
      </>
    );
  }
}
