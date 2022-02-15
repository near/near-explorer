import BN from "bn.js";
import moment from "moment";

import { FC, useCallback } from "react";
import { Row, Col } from "react-bootstrap";

import Balance from "../utils/Balance";
import Link from "../utils/Link";

import { useTranslation } from "react-i18next";
import { useWampQuery } from "../../hooks/wamp";
import { Account, getAccount } from "../../providers/accounts";
import { styled } from "../../libraries/styles";

const TransactionRow = styled(Row, {
  paddingTop: 10,
  paddingBottom: 10,
  borderTop: "solid 2px #f8f8f8",
  "&:hover": {
    background: "rgba(0, 0, 0, 0.1)",
  },
});

const TransactionRowTitle = styled(Col, {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.29,
  color: "#24272a",
  wordBreak: "break-word",
});

const TransactionRowTransactionId = styled(Col, {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.29,
  color: "#0072ce",
});

const TransactionRowTimer = styled("div", {
  fontSize: 12,
  color: "#666666",
  fontWeight: 300,
});

const LinkWrapper = styled("a", {
  textDecoration: "none",
});

const AccountIcon = styled("img", {
  width: 15,
});

export interface Props {
  accountId: string;
}

export interface State {
  nonStakedBalance?: BN;
  deletedAtBlockTimestamp?: number;
  createdAtBlockTimestamp?: number;
}

const AccountRow: FC<Props> = ({ accountId }) => {
  const { t } = useTranslation();
  const accountInfo = useWampQuery<Account>(
    useCallback((wampCall) => getAccount(wampCall, accountId), [accountId])
  );

  return (
    <Link href="/accounts/[id]" as={`/accounts/${accountId}`} passHref>
      <LinkWrapper>
        <TransactionRow className="mx-0">
          <Col md="auto" xs="1" className="pr-0">
            <AccountIcon
              src={
                accountInfo?.deletedAtBlockTimestamp
                  ? "/static/images/icon-t-acct-delete.svg"
                  : "/static/images/icon-t-acct.svg"
              }
            />
          </Col>
          <TransactionRowTitle md="7" xs="11" className="pt-1">
            {accountId}
          </TransactionRowTitle>
          <TransactionRowTransactionId
            md="3"
            xs="5"
            className="ml-auto pt-1 text-right"
          >
            {accountInfo ? (
              accountInfo.deletedAtBlockTimestamp ? (
                <TransactionRowTimer>
                  {t("component.accounts.AccountRow.deleted_on")}{" "}
                  {moment(accountInfo.deletedAtBlockTimestamp).format("LL")}
                </TransactionRowTimer>
              ) : (
                <>
                  <Balance amount={accountInfo.nonStakedBalance} />
                  <TransactionRowTimer>
                    {t("component.accounts.AccountRow.created_on")}{" "}
                    {moment(accountInfo.createdAtBlockTimestamp).format("LL")}
                  </TransactionRowTimer>
                </>
              )
            ) : null}
          </TransactionRowTransactionId>
        </TransactionRow>
      </LinkWrapper>
    </Link>
  );
};

export default AccountRow;
