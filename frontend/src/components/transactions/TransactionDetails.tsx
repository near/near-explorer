import { Row, Col } from "react-bootstrap";

import { Transaction } from "../../libraries/explorer-wamp/transactions";
import moment from "../../libraries/moment";

import AccountLink from "../utils/AccountLink";
import BlockLink from "../utils/BlockLink";
import CardCell from "../utils/CardCell";

export interface Props {
  transaction: Transaction;
}

export default ({ transaction }: Props) => {
  return (
    <div className="transaction-info-container">
      <Row noGutters>
        <Col md="5">
          <CardCell
            title="Signed by"
            imgLink="/static/images/icon-m-user.svg"
            text={<AccountLink accountId={transaction.signerId} />}
            className="border-0"
          />
        </Col>
        <Col md="5">
          <CardCell
            title="Receiver"
            imgLink="/static/images/icon-m-user.svg"
            text={<AccountLink accountId={transaction.receiverId} />}
          />
        </Col>
        <Col md="2">
          <CardCell
            title="Status"
            imgLink="/static/images/icon-m-filter.svg"
            text={transaction.status}
          />
        </Col>
      </Row>
      <Row noGutters className="border-0">
        <Col md="4">
          <CardCell
            title="Created"
            text={moment(transaction.blockTimestamp).format(
              "MMMM DD, YYYY [at] h:mm:ssa"
            )}
            className="border-0"
          />
        </Col>
        <Col md="8">
          <CardCell title="Hash" text={transaction.hash} className="border-0" />
        </Col>
      </Row>
      <Row noGutters>
        <Col md="12">
          <CardCell
            title="Block Hash"
            text={
              <BlockLink blockHash={transaction.blockHash}>
                {transaction.blockHash}
              </BlockLink>
            }
            className="transaction-card-block-hash border-0"
          />
        </Col>
      </Row>
      <style jsx global>{`
        .transaction-info-container {
          border: solid 4px #e6e6e6;
          border-radius: 4px;
        }

        .transaction-info-container > .row {
          border-bottom: 2px solid #e6e6e6;
        }

        .transaction-info-container > .row:last-of-type {
          border-bottom: 0;
        }

        .transaction-info-container > .row:first-of-type .card-cell-text {
          font-size: 24px;
        }

        .transaction-card-block-hash {
          background-color: #f8f8f8;
        }
      `}</style>
    </div>
  );
};
