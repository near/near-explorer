import Head from "next/head";

import { Container, Spinner } from "react-bootstrap";

import AccountDetails from "../../components/accounts/AccountDetails";
import ContractDetails from "../../components/contracts/ContractDetails";
import Transactions, {
  getNextPageParam,
} from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

import TransactionIconSvg from "../../../public/static/images/icon-t-transactions.svg";

import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import { trpc } from "../../libraries/trpc";
import { styled } from "../../libraries/styles";
import * as React from "react";
import {
  getServerSideProps as getBetaServerSideProps,
  default as BetaAccountPage,
} from "../beta/accounts/[...slug]";
import { useAccountPageOptions } from "../../hooks/use-account-page-options";
import { getBetaOptionsFromReq } from "../../libraries/beta";
import { useBeta } from "../../hooks/use-beta";
import { TRPCQueryResult } from "../../types/common";
import ErrorMessage from "../../components/utils/ErrorMessage";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

const TRANSACTIONS_PER_PAGE = 10;

const InnerAccountDetail = React.memo<{
  query: TRPCQueryResult<"account.byIdOld">;
  accountId: string;
}>(({ query, accountId }) => {
  const { t } = useTranslation();
  switch (query.status) {
    case "loading":
    case "idle":
      return <Spinner animation="border" />;
    case "success":
      if (query.data) {
        return <AccountDetails account={query.data} />;
      }
      return (
        <>
          {t("page.accounts.error.account_not_found", {
            account_id: accountId,
          })}
        </>
      );
    case "error":
      return (
        <ErrorMessage onRetry={query.refetch}>
          {query.error.message}
        </ErrorMessage>
      );
  }
});

const AccountDetail = React.memo(() => {
  const { accountId } = useAccountPageOptions();
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Account", {
    accountId,
  });
  const accountQuery = trpc.useQuery(["account.byIdOld", { id: accountId }]);
  const transactionsQuery = trpc.useInfiniteQuery(
    [
      "transaction.listByAccountId",
      { accountId, limit: TRANSACTIONS_PER_PAGE },
    ],
    { getNextPageParam }
  );

  return (
    <>
      <Head>
        <title>NEAR Explorer | Account</title>
      </Head>
      <Content
        title={
          <h1>
            {t("common.accounts.account")}
            {`: @${accountId}`}
          </h1>
        }
        border={false}
      >
        <InnerAccountDetail query={accountQuery} accountId={accountId} />
      </Content>
      {accountQuery.status === "success" ? (
        <>
          <Container>
            <ContractDetails accountId={accountId} />
          </Container>
          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("common.transactions.transactions")}</h2>}
          >
            <Transactions query={transactionsQuery} />
          </Content>
        </>
      ) : null}
    </>
  );
});

export const getServerSideProps: GetServerSideProps<
  {},
  { slug: string[] }
> = async (context) => {
  if (getBetaOptionsFromReq(context.req)?.enabled) {
    return getBetaServerSideProps(context);
  }
  const accountId = context.params?.slug[0] ?? "";
  if (/[A-Z]/.test(accountId)) {
    return {
      redirect: {
        permanent: true,
        destination: `/accounts/${accountId.toLowerCase()}`,
      },
    };
  }
  return { props: {} };
};

const AccountDetailsWithBeta: NextPage = React.memo(() => {
  const isBeta = useBeta();
  if (isBeta) {
    return <BetaAccountPage />;
  }
  return <AccountDetail />;
});

export default AccountDetailsWithBeta;
