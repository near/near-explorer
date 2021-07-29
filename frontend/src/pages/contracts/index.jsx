import Head from "next/head";
import { Component } from "react";
import Content from "../../components/utils/Content";

class Contracts extends Component {
  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Contracts</title>
        </Head>
        <Content title={<h1>Contracts</h1>} count=""></Content>
      </>
    );
  }
}

export default Contracts;
