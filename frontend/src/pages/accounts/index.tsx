import Head from "next/head";

import Accounts from "../../components/accounts/Accounts";
import Content from "../../components/utils/Content";

import { Translate } from "react-localize-redux";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";

const AccountsPage: NextPage = () => {
  useAnalyticsTrackOnMount("Explorer View Accounts Page");

  return (
    <>
      <Head>
        <title>NEAR Explorer | Accounts</title>
      </Head>
      <Content
        title={
          <h1>
            <Translate id="common.accounts.accounts" />
          </h1>
        }
      >
        <Accounts />
      </Content>
    </>
  );
};

export default AccountsPage;
