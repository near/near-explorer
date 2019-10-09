import Head from "next/head";

import Accounts from "../../components/accounts/Accounts";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Accounts</title>
        </Head>
        <Content title="Accounts" count="">
          <Accounts />
        </Content>
      </>
    );
  }
}
