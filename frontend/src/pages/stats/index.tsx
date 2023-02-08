import Head from "next/head";

import Content from "@explorer/frontend/components/utils/Content";
import TransactionsByDate from "@explorer/frontend/components/stats/TransactionsByDate";
import GasUsedByDate from "@explorer/frontend/components/stats/GasUsedByDate";
import NewAccountsByDate from "@explorer/frontend/components/stats/NewAccountsByDate";
import NewContractsByDate from "@explorer/frontend/components/stats/NewContractsByDate";
import ActiveAccountsByDate from "@explorer/frontend/components/stats/ActiveAccountsByDate";
import ActiveContractsByDate from "@explorer/frontend/components/stats/ActiveContractsByDate";
import ActiveAccountsList from "@explorer/frontend/components/stats/ActiveAccountsList";
import ActiveContractsList from "@explorer/frontend/components/stats/ActiveContractsList";
import ProtocolConfigInfo from "@explorer/frontend/components/stats/ProtocolConfigInfo";
import CirculatingSupplyStats from "@explorer/frontend/components/stats/CirculatingSupplyStats";
import { useNetworkContext } from "@explorer/frontend/hooks/use-network-context";

import { useTranslation } from "react-i18next";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "@explorer/frontend/hooks/analytics/use-analytics-track-on-mount";
import * as React from "react";

const chartStyle = {
  height: 480,
  width: "100%",
  marginTop: 26,
  marginLeft: 24,
};

const Stats: NextPage = React.memo(() => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Stats page");
  const { networkName } = useNetworkContext();

  return (
    <>
      <Head>
        <title>NEAR Explorer | Stats</title>
      </Head>
      <Content title={<h1>{t("common.stats.title")}</h1>}>
        <div id="protocolConfiguration">
          <ProtocolConfigInfo />
        </div>
        {networkName === "mainnet" ? (
          <div id="circulatingSupply">
            <CirculatingSupplyStats chartStyle={chartStyle} />
          </div>
        ) : null}
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
      </Content>
    </>
  );
});

export default Stats;
