import Head from "next/head";

const Transactions = props => (
  <>
    <Head>
      <link rel="shortcut icon" type="image/png" href="/static/favicon.ico" />
      <title>Near Explorer | Transactions</title>
    </Head>
  </>
);

Transactions.getInitialProps = async ({ query: { hash } }) => {
  console.log(hash);
};

export default Transactions;
