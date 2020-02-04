import React from "react";
import { Row, Col } from "react-bootstrap";
import moment from "moment";

import AccountsApi, {
  Account,
  AccountBasicInfo
} from "../../libraries/explorer-wamp/accounts";

import Balance from "../utils/Balance";
import CardCell from "../utils/CardCell";

export interface Props {
  id: string;
  account: Account;
}

export interface State {
  accountBasic: AccountBasicInfo;
}

export default class extends React.Component<Props, State> {
  state: State = {
    accountBasic: {
      id: this.props.id,
      timestamp: 1577836800000,
      address: "Not disclosed"
    }
  };

  _getBasic = async () => {
    const basic = await new AccountsApi().getAccountBasic(this.props.id);
    this.setState({ accountBasic: basic });
  };

  componentDidMount() {
    this._getBasic();
  }

  render() {
    const { account } = this.props;
    console.log(account);
    const { accountBasic } = this.state;
    return (
      <div className="account-info-container">
        <Row noGutters>
          <Col md="3">
            <CardCell
              title="Ⓝ Balance"
              text={<Balance amount={account.amount} />}
              className="border-0"
            />
          </Col>
          <Col md="3">
            <CardCell
              title="Transactions"
              imgLink="/static/images/icon-m-transaction.svg"
              text={
                <>
                  <span>
                    &uarr;{account.outTransactionsCount.toLocaleString()}
                  </span>
                  &nbsp;&nbsp;
                  <span>
                    &darr;{account.inTransactionsCount.toLocaleString()}
                  </span>
                </>
              }
            />
          </Col>
          <Col md="2">
            <CardCell
              title="Locked"
              imgLink="/static/images/icon-m-filter.svg"
              text={<Balance amount={account.locked} />}
            />
          </Col>
          <Col md="4">
            <CardCell
              title="Storage (Used / Paid)"
              imgLink="/static/images/icon-m-block.svg"
              text={`${account.storageUsage.toLocaleString()} / ${account.storagePaidAt.toLocaleString()}`}
            />
          </Col>
        </Row>
        <Row noGutters className="border-0">
          <Col md="4">
            <CardCell
              title="Created"
              text={moment(accountBasic.timestamp).format(
                "MMMM DD, YYYY [at] h:mm:ssa"
              )}
              className="block-card-created account-card-back border-0"
            />
          </Col>
          <Col md="8">
            <CardCell
              title="Address"
              text={accountBasic.address}
              className="block-card-created-text account-card-back border-0"
            />
          </Col>
        </Row>
        <style jsx global>{`
          .account-info-container {
            border: solid 4px #e6e6e6;
            border-radius: 4px;
          }

          .account-info-container > .row:first-of-type .card-cell-text {
            font-size: 24px;
          }

          .account-info-container > .row {
            border-bottom: 2px solid #e6e6e6;
          }

          .account-card-back {
            background-color: #f8f8f8;
          }
        `}</style>
      </div>
    );
  }
}
