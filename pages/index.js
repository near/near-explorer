import Head from "next/head";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";

export default () => (
  <div>
    <Head>
      <link rel="shortcut icon" type="image/png" href="/static/favicon.ico" />
      <title>Near -- dashboard</title>
    </Head>
    <Header />
    <Footer />
  </div>
);
