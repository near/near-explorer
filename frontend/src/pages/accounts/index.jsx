import Head from "next/head";
import { PureComponent } from "react";
import Mixpanel from "../../libraries/mixpanel";

import Accounts from "../../components/accounts/Accounts";
import Content from "../../components/utils/Content";

import { Translate } from "react-localize-redux";

class AccountsPage extends PureComponent {
  componentDidMount() {
    Mixpanel.track("Explorer View Accounts Page");
  }

  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Accounts</title>
        </Head>
        <Content
          title={
            <h1>
              <Translate id="common.accounts.accounts" />
            </h1>
          }
        >
          <Accounts />
        </Content>
      </>
    );
  }
}

export default AccountsPage;
