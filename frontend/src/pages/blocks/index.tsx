import Head from "next/head";

import Blocks from "../../components/blocks/Blocks";
import Content from "../../components/utils/Content";

import { Translate } from "react-localize-redux";
import { NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";

const BlocksPage: NextPage = () => {
  useAnalyticsTrackOnMount("Explorer View Blocks Page");

  return (
    <Translate>
      {({ translate }) => (
        <>
          <Head>
            <title>NEAR Explorer | Blocks</title>
          </Head>
          <Content title={<h1>{translate("common.blocks.blocks")}</h1>}>
            <Blocks />
          </Content>
        </>
      )}
    </Translate>
  );
};

export default BlocksPage;
