import * as React from "react";

import { NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";

import Blocks from "@/frontend/components/blocks/Blocks";
import Content from "@/frontend/components/utils/Content";
import { useAnalyticsTrackOnMount } from "@/frontend/hooks/analytics/use-analytics-track-on-mount";

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
