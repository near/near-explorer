import * as React from "react";

import { useTranslation } from "next-i18next";
import { Row, Col } from "react-bootstrap";

import { TRPCQueryOutput } from "@explorer/common/types/trpc";
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

const AccountIcon = styled("img", {
  width: 15,
});

export interface Props {
  account: TRPCQueryOutput<"account.listByTimestamp">[number];
}

const AccountRow: React.FC<Props> = React.memo(({ account }) => {
  const { t } = useTranslation();
  const balanceQuery = trpc.useQuery([
    "account.nonStakedBalance",
    { id: account.id },
  ]);
  const format = useDateFormat();

  return (
    <Link href={`/accounts/${account.id}`}>
      <TransactionRow className="mx-0">
        <Col md="auto" xs="1" className="pr-0">
          <AccountIcon
            src={
              account.deletedTimestamp
                ? "/static/images/icon-t-acct-delete.svg"
                : "/static/images/icon-t-acct.svg"
            }
          />
        </Col>
        <TransactionRowTitle md="7" xs="11" className="pt-1">
          {account.id}
        </TransactionRowTitle>
        <TransactionRowTransactionId
          md="3"
          xs="5"
          className="ml-auto pt-1 text-right"
        >
          {account.deletedTimestamp ? (
            <TransactionRowTimer>
              {t("component.accounts.AccountRow.deleted_on")}{" "}
              {format(account.deletedTimestamp, "PPP")}
              <CopyToClipboard
                text={String(account.deletedTimestamp)}
                css={{ marginLeft: 8 }}
              />
            </TransactionRowTimer>
          ) : (
            <>
              {balanceQuery.status === "success" ? (
                <Balance amount={balanceQuery.data} />
              ) : null}
              <TransactionRowTimer>
                {t("component.accounts.AccountRow.created_on")}{" "}
                {account.createdTimestamp ? (
                  <>
                    {format(account.createdTimestamp, "PPP")}
                    <CopyToClipboard
                      text={String(account.createdTimestamp)}
                      css={{ marginLeft: 8 }}
                    />
                  </>
                ) : (
                  "Genesis"
                )}
              </TransactionRowTimer>
            </>
          )}
        </TransactionRowTransactionId>
      </TransactionRow>
    </Link>
  );
});

export default AccountRow;
