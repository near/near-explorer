import * as React from "react";

import { useTranslation } from "next-i18next";
import { Row, Col } from "react-bootstrap";

import Balance from "@explorer/frontend/components/utils/Balance";
import CopyToClipboard from "@explorer/frontend/components/utils/CopyToClipboard";
import Link from "@explorer/frontend/components/utils/Link";
import { useDateFormat } from "@explorer/frontend/hooks/use-date-format";
import { styled } from "@explorer/frontend/libraries/styles";
import { trpc } from "@explorer/frontend/libraries/trpc";

const TransactionRow = styled(Row, {
  paddingVertical: 10,
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

const AccountRow: React.FC<Props> = React.memo(({ accountId }) => {
  const { t } = useTranslation();
  const { data: accountInfo } = trpc.useQuery([
    "account.byIdOld",
    { id: accountId },
  ]);
  const format = useDateFormat();

  return (
    <Link href={`/accounts/${accountId}`} passHref>
      <LinkWrapper>
        <TransactionRow className="mx-0">
          <Col md="auto" xs="1" className="pr-0">
            <AccountIcon
              src={
                accountInfo?.deleted
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
              accountInfo.deleted ? (
                <TransactionRowTimer>
                  {t("component.accounts.AccountRow.deleted_on")}{" "}
                  {format(accountInfo.deleted.timestamp, "PPP")}
                  <CopyToClipboard
                    text={String(accountInfo.deleted.timestamp)}
                    css={{ marginLeft: 8 }}
                  />
                </TransactionRowTimer>
              ) : (
                <>
                  <Balance
                    amount={accountInfo.details?.nonStakedBalance ?? "0"}
                  />
                  <TransactionRowTimer>
                    {t("component.accounts.AccountRow.created_on")}{" "}
                    {accountInfo.created ? (
                      <>
                        {format(accountInfo.created.timestamp, "PPP")}
                        <CopyToClipboard
                          text={String(accountInfo.created.timestamp)}
                          css={{ marginLeft: 8 }}
                        />
                      </>
                    ) : (
                      "Genesis"
                    )}
                  </TransactionRowTimer>
                </>
              )
            ) : null}
          </TransactionRowTransactionId>
        </TransactionRow>
      </LinkWrapper>
    </Link>
  );
});

export default AccountRow;
