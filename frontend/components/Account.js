import Link from "next/link";

import moment from "moment";
import { Row, Col, Card } from "react-bootstrap";

import Balance from "./utils/Balance";

const AccountCard = props => (
  <Card className={`account-card ${props.cls || ""}`}>
    <Card.Body>
      <Row noGutters="true">
        <Col xs="auto" md="12" className="account-card-title align-self-center">
          {props.imgLink ? (
            <img src={props.imgLink} className="account-card-title-img" />
          ) : null}
          {props.title}
        </Col>
        <Col
          xs="auto"
          md="12"
          className="ml-auto account-card-text align-self-center"
        >
          {props.text}
        </Col>
      </Row>
    </Card.Body>
    <style jsx global>{`
      .account-card {
        border: solid 4px #e6e6e6;
        border-radius: 0;
      }

      .account-card-title {
        text-transform: uppercase;
        letter-spacing: 1.8px;
        color: #999999;
        font-family: BentonSans;
        font-size: 14px;
        font-weight: 500;
      }

      .account-card-title-img {
        width: 12px !important;
        margin-right: 8px;
        margin-top: -3px;
      }

      .account-card-text {
        font-family: BwSeidoRound;
        font-size: 24px;
        font-weight: 500;
        color: #24272a;
      }
    `}</style>
  </Card>
);

const Account = ({ account }) => {
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
                    <span>&uarr;{account.outTransactionsCount}</span>
                    &nbsp;&nbsp;
                    <span>&darr;{account.inTransactionsCount}</span>
                  </>
                }
              />
            </Col>
            <Col md="3">
              <AccountCard
                title="Staked"
                imgLink="/static/images/icon-m-filter.svg"
                text={account.staked}
              />
            </Col>
            <Col md="3">
              <AccountCard
                title="Storage"
                imgLink="/static/images/icon-m-block.svg"
                text={`${account.storage_usage} / ${account.storage_paid_at}`}
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

export default Account;
