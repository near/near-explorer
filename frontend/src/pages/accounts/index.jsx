import Head from "next/head";

import { Mixpanel } from "../../libraries/mixpanel";

import Accounts from "../../components/accounts/Accounts";
import Content from "../../components/utils/Content";

export default class extends React.Component {
  render() {
    Mixpanel.track("View Accounts Page");
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
