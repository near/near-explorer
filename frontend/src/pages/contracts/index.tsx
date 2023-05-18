import * as React from "react";

import { NextPage } from "next";
import Head from "next/head";

import Content from "@/frontend/components/utils/Content";

const Contracts: NextPage = React.memo(() => (
  <>
    <Head>
      <title>NEAR Explorer | Contracts</title>
    </Head>
    <Content title={<h1>Contracts</h1>} />
  </>
));

export default Contracts;
