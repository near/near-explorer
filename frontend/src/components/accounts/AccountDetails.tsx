import { Row, Col } from "react-bootstrap";
import moment from "moment";

import { Account } from "../../libraries/explorer-wamp/accounts";

import Balance from "../utils/Balance";
import CardCell from "../utils/CardCell";

export interface Props {
  account: Account;
}

export default ({ account }: Props) => {
  let timestamp = Number(account.timestamp);
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
            text={moment(timestamp).format("MMMM DD, YYYY [at] h:mm:ssa")}
            className="block-card-created account-card-back border-0"
          />
        </Col>
        <Col md="8">
          <CardCell
            title="Address"
            text={account.address}
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
};
