import Head from "next/head";

export default class extends React.Component {
  static async getInitialProps({ query: { hash } }) {
    return { hash };
  }

  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Transactions</title>
        </Head>
      </>
    );
  }
}
