import Head from "next/head";

import Blocks from "@explorer/frontend/components/blocks/Blocks";
import Content from "@explorer/frontend/components/utils/Content";

import { useTranslation } from "react-i18next";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "@explorer/frontend/hooks/analytics/use-analytics-track-on-mount";
import * as React from "react";

const BlocksPage: NextPage = React.memo(() => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Blocks Page");

  return (
    <>
      <Head>
        <title>NEAR Explorer | Blocks</title>
      </Head>
      <Content title={<h1>{t("common.blocks.blocks")}</h1>}>
        <Blocks />
      </Content>
    </>
  );
});

export default BlocksPage;
