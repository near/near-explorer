import Head from "next/head";
import { useEffect } from "react";
import Mixpanel from "../../libraries/mixpanel";

import Accounts from "../../components/accounts/Accounts";
import Content from "../../components/utils/Content";

import { Translate } from "react-localize-redux";
import { NextPage } from "next";

const AccountsPage: NextPage = () => {
  useEffect(() => {
    Mixpanel.track("Explorer View Accounts Page");
  }, []);
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
