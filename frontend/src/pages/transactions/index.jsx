import Head from "next/head";

import Mixpanel from "../../libraries/mixpanel";

import Content from "../../components/utils/Content";
import Transactions from "../../components/transactions/Transactions";

import { setI18N } from "../../libraries/language.js";
import { Translate, withLocalize } from "react-localize-redux";

class TransactionsPage extends React.Component {
  componentDidMount() {
    Mixpanel.track("Explorer View Transactions Page");
  }

  constructor(props) {
    super(props);
    setI18N(this.props);
  }

  render() {
    return (
      <Translate>
        {({ translate }) => (
          <>
            <Head>
              <title>NEAR Explorer | Transactions</title>
            </Head>
            <Content title={<h1>{translate("model.transactions.title").toString()}</h1>}>
              <Transactions />
            </Content>
          </>
        )}
      </Translate>
    );
  }
}

export default withLocalize(TransactionsPage);
