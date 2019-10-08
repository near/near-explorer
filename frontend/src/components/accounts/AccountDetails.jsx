import { Row, Col } from "react-bootstrap";

import Balance from "../utils/Balance";

import AccountCard from "./AccountCard";

export default ({ account }) => {
  return (
    <>
      <Row noGutters="true">
        <Col className="account-info-container">
          <Row noGutters="true">
            <Col md="3">
              <AccountCard
                title="Ⓝ Balance"
                text={<Balance amount={account.amount} />}
                cls="account-card-no-side-border"
              />
            </Col>
            <Col md="3">
              <AccountCard
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
              <AccountCard
                title="Staked"
                imgLink="/static/images/icon-m-filter.svg"
                text={<Balance amount={account.staked} />}
              />
            </Col>
            <Col md="3">
              <AccountCard
                title="Storage (Used / Paid)"
                imgLink="/static/images/icon-m-block.svg"
                text={`${account.storage_usage.toLocaleString()} / ${account.storage_paid_at.toLocaleString()}`}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <style jsx global>{`
        .account-card-created-text {
          font-size: 18px;
          font-weight: 500;
          color: #4a4f54;
        }

        .account-card-author-text {
          color: #0072ce;
        }

        .account-card-parent-hash-text {
          font-size: 18px;
          font-weight: 500;
          color: #6ad1e3;
          cursor: pointer;
          text-decoration: none !important;
        }

        .account-card-parent-hash-text:hover {
          color: #6ad1e3;
        }

        .account-card-parent-hash {
          background-color: #f8f8f8;
        }

        .account-info-container .account-card {
          border-top: 0;
          border-bottom-width: 2px;
          border-right: 0;
          border-left-width: 2px;
        }

        .account-info-container .account-card-no-side-border {
          border-left: 0;
          border-right: 0;
        }

        .account-info-container .account-card-no-border {
          border: 0;
        }

        .account-info-container {
          border: solid 4px #e6e6e6;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};
