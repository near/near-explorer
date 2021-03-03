import Head from "next/head";

import Accounts from "../../components/accounts/Accounts";
import Content from "../../components/utils/Content";

class Accounts extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Accounts</title>
        </Head>
        <Content title={<h1>Accounts</h1>}>
          <Accounts />
        </Content>
      </>
    );
  }
}

export default Accounts;
