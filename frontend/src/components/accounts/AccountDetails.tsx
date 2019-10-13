import { Row, Col } from "react-bootstrap";

import { Account } from "../../libraries/explorer-wamp/accounts";

import Balance from "../utils/Balance";
import CardCell from "../utils/CardCell";

export interface Props {
  account: Account;
}

export default ({ account }: Props) => {
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
        <Col md="3">
          <CardCell
            title="Staked"
            imgLink="/static/images/icon-m-filter.svg"
            text={<Balance amount={account.staked} />}
          />
        </Col>
        <Col md="3">
          <CardCell
            title="Storage (Used / Paid)"
            imgLink="/static/images/icon-m-block.svg"
            text={`${account.storageUsage.toLocaleString()} / ${account.storagePaidAt.toLocaleString()}`}
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
      `}</style>
    </div>
  );
};
