import Head from "next/head";

import Mixpanel from "../../libraries/mixpanel";

import Accounts from "../../components/accounts/Accounts";
import Content from "../../components/utils/Content";

class AccountsPage extends React.PureComponent {
  render() {
    Mixpanel.track("Explorer View Accounts Page");
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

export default AccountsPage;
