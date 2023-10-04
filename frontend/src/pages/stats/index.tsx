import * as React from "react";

import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";

import { ExplorerSunsetBanner } from "@/frontend/components/common/ExplorerSunsetBanner";
import { ActiveAccountsByDate } from "@/frontend/components/stats/ActiveAccountsByDate";
import { ActiveAccountsList } from "@/frontend/components/stats/ActiveAccountsList";
import { ActiveContractsByDate } from "@/frontend/components/stats/ActiveContractsByDate";
import { ActiveContractsList } from "@/frontend/components/stats/ActiveContractsList";
import { CirculatingSupplyStats } from "@/frontend/components/stats/CirculatingSupplyStats";
import { GasUsedByDate } from "@/frontend/components/stats/GasUsedByDate";
import { NewAccountsByDate } from "@/frontend/components/stats/NewAccountsByDate";
import { NewContractsByDate } from "@/frontend/components/stats/NewContractsByDate";
import { ProtocolConfigInfo } from "@/frontend/components/stats/ProtocolConfigInfo";
import { TransactionsByDate } from "@/frontend/components/stats/TransactionsByDate";
import { Content } from "@/frontend/components/utils/Content";
import { useAnalyticsTrackOnMount } from "@/frontend/hooks/analytics/use-analytics-track-on-mount";
import { useNetworkContext } from "@/frontend/hooks/use-network-context";

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
      <div style={{ maxWidth: "1110px", margin: "0 auto" }}>
        <ExplorerSunsetBanner /> {/* Add the banner component here */}
      </div>
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
