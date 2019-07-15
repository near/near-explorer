import Head from "next/head";

import Header from "../../components/Header";
import Contracts from "../../components/Contracts";
import Footer from "../../components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";

export default () => (
  <div>
    <Head>
      <link rel="shortcut icon" type="image/png" href="/static/favicon.ico" />
      <title>Near Explorer | Contracts</title>
    </Head>
    <Header />
    <Contracts />
    <Footer />
    <style jsx global>{`
      body {
        background-color: #f8f8f8;
      }
    `}</style>
  </div>
);
