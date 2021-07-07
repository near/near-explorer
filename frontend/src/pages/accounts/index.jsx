import Head from "next/head";

import Mixpanel from "../../libraries/mixpanel";

import Accounts from "../../components/accounts/Accounts";
import Content from "../../components/utils/Content";

import { setI18N } from "../../libraries/language.js";
import { Translate, withLocalize } from "react-localize-redux";

class AccountsPage extends React.PureComponent {
  componentDidMount() {
    Mixpanel.track("Explorer View Accounts Page");
  }
  
  constructor(props) {
    super(props);
    setI18N(this.props);
  }

  render() {
    return (
      <>
        <Head>
          <title>NEAR Explorer | Accounts</title>
        </Head>
        <Content title={<h1><Translate id="model.accounts.title" /></h1>}>
          <Accounts />
        </Content>
      </>
    );
  }
}

export default withLocalize(AccountsPage);
