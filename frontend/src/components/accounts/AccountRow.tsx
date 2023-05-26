import * as React from "react";

import { useTranslation } from "next-i18next";
import { Row, Col, Spinner } from "react-bootstrap";

import { TRPCQueryOutput } from "@/common/types/trpc";
import { Balance } from "@/frontend/components/utils/Balance";
import { CopyToClipboard } from "@/frontend/components/utils/CopyToClipboard";
import { ErrorMessage } from "@/frontend/components/utils/ErrorMessage";
import { Link } from "@/frontend/components/utils/Link";
import { useDateFormat } from "@/frontend/hooks/use-date-format";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";

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

export const AccountRow: React.FC<Props> = React.memo(({ account }) => {
  const { t } = useTranslation();
  const balanceQuery = trpc.account.nonStakedBalance.useQuery({
    id: account.id,
  });
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
              ) : balanceQuery.status === "loading" ? (
                <Spinner animation="border" />
              ) : (
                <ErrorMessage onRetry={balanceQuery.refetch}>
                  {balanceQuery.error.message}
                </ErrorMessage>
              )}
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
