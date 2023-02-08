import Head from "next/head";

import Accounts from "@explorer/frontend/components/accounts/Accounts";
import Content from "@explorer/frontend/components/utils/Content";

import { useTranslation } from "react-i18next";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "@explorer/frontend/hooks/analytics/use-analytics-track-on-mount";
import * as React from "react";

const AccountsPage: NextPage = React.memo(() => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Accounts Page");

  return (
    <>
      <Head>
        <title>NEAR Explorer | Accounts</title>
      </Head>
      <Content title={<h1>{t("common.accounts.accounts")}</h1>}>
        <Accounts />
      </Content>
    </>
  );
});

export default AccountsPage;
