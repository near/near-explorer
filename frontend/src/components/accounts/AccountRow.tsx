import BN from "bn.js";
import moment from "moment";

import { FC, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

import AccountsApi from "../../libraries/explorer-wamp/accounts";

import Balance from "../utils/Balance";
import Link from "../utils/Link";

import { useTranslation } from "react-i18next";

export interface Props {
  accountId: string;
}

export interface State {
  nonStakedBalance?: BN;
  deletedAtBlockTimestamp?: number | null;
  createdAtBlockTimestamp?: number | null;
}

const AccountRow: FC<Props> = ({ accountId }) => {
  const { t } = useTranslation();
  const [
    { nonStakedBalance, deletedAtBlockTimestamp, createdAtBlockTimestamp },
    setState,
  ] = useState<State>({});
  useEffect(() => {
    new AccountsApi()
      .getAccountInfo(accountId)
      .then((accountInfo) => {
        setState({
          nonStakedBalance: new BN(accountInfo.nonStakedBalance),
          deletedAtBlockTimestamp: accountInfo.deletedAtBlockTimestamp,
          createdAtBlockTimestamp: accountInfo.createdAtBlockTimestamp,
        });
      })
      .catch((error) => {
        console.warn(
          "Account information retrieval failed for ",
          accountId,
          error
        );
      });
  }, [accountId]);
  return (
    <Link href="/accounts/[id]" as={`/accounts/${accountId}`}>
      <a style={{ textDecoration: "none" }}>
        <Row className="transaction-row mx-0">
          <Col md="auto" xs="1" className="pr-0">
            <img
              src={
                deletedAtBlockTimestamp
                  ? "/static/images/icon-t-acct-delete.svg"
                  : "/static/images/icon-t-acct.svg"
              }
              style={{ width: "15px" }}
            />
          </Col>
          <Col md="7" xs="11" className="transaction-row-title pt-1">
            {accountId}
          </Col>
          <Col
            md="3"
            xs="5"
            className="ml-auto pt-1 text-right transaction-row-txid"
          >
            {deletedAtBlockTimestamp ? (
              <div className="transaction-row-timer">
                {t("component.accounts.AccountRow.deleted_on")}{" "}
                {moment(deletedAtBlockTimestamp).format("LL")}
              </div>
            ) : typeof nonStakedBalance !== "undefined" ? (
              <>
                <Balance amount={nonStakedBalance} />
                <div className="transaction-row-timer">
                  {t("component.accounts.AccountRow.created_on")}{" "}
                  {moment(createdAtBlockTimestamp).format("LL")}
                </div>
              </>
            ) : null}
          </Col>
          <style jsx global>{`
            .transaction-row {
              padding-top: 10px;
              padding-bottom: 10px;
              border-top: solid 2px #f8f8f8;
            }

            .transaction-row:hover {
              background: rgba(0, 0, 0, 0.1);
            }

            .transaction-row-title {
              font-size: 14px;
              font-weight: 500;
              line-height: 1.29;
              color: #24272a;
              word-break: break-word;
            }

            .transaction-row-text {
              font-size: 12px;
              font-weight: 500;
              line-height: 1.5;
              color: #999999;
            }

            .transaction-row-txid {
              font-size: 14px;
              font-weight: 500;
              line-height: 1.29;
              color: #0072ce;
            }

            .transaction-row-timer {
              font-size: 12px;
              color: #666666;
              font-weight: 300;
            }

            .transaction-row-timer-status {
              font-weight: 500;
            }
          `}</style>
        </Row>
      </a>
    </Link>
  );
};

export default AccountRow;
