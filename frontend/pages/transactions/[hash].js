import Head from "next/head";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";

const Transactions = (props) => (
  <div>
    <Head>
      <link rel="shortcut icon" type="image/png" href="/static/favicon.ico" />
      <title>Near Explorer | Transactions</title>
    </Head>
    <Header />
    <Footer />
    <style jsx global>{`
      body {
        background-color: #f8f8f8;
      }
    `}</style>
  </div>
);

Transactions.getInitialProps = async ({ query: { hash }}) => {
  console.log(hash);
}

export default Transactions;
