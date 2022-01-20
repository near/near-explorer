import Head from "next/head";

import Blocks from "../../components/blocks/Blocks";
import Content from "../../components/utils/Content";

import { useTranslation } from "react-i18next";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";

const BlocksPage: NextPage = () => {
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
};

export default BlocksPage;
