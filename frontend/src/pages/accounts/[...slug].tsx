import * as React from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { stringify } from "querystring";
import { Spinner } from "react-bootstrap";

import { TRPCQueryResult } from "@/common/types/trpc";
import AccountDetails from "@/frontend/components/accounts/AccountDetails";
import ContractDetails from "@/frontend/components/contracts/ContractDetails";
import Transactions, {
  getNextPageParam,
} from "@/frontend/components/transactions/Transactions";
import Content from "@/frontend/components/utils/Content";
import ErrorMessage from "@/frontend/components/utils/ErrorMessage";
import { useAnalyticsTrackOnMount } from "@/frontend/hooks/analytics/use-analytics-track-on-mount";
import { useAccountPageOptions } from "@/frontend/hooks/use-account-page-options";
import { useBeta } from "@/frontend/hooks/use-beta";
import { getBetaOptionsFromReq } from "@/frontend/libraries/beta";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";
import BetaAccountPage, {
  getServerSideProps as getBetaServerSideProps,
} from "@/frontend/pages/beta/accounts/[...slug]";
import TransactionIconSvg from "@/frontend/public/static/images/icon-t-transactions.svg";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

const TRANSACTIONS_PER_PAGE = 10;

type TransactionProps = {
  accountId: string;
};

const AccountTransactions = React.memo<TransactionProps>(({ accountId }) => {
  const transactionsQuery = trpc.useInfiniteQuery(
    [
      "transaction.listByAccountId",
      { accountId, limit: TRANSACTIONS_PER_PAGE },
    ],
    { getNextPageParam }
  );
  return <Transactions query={transactionsQuery} />;
});

type QueryProps = {
  query: TRPCQueryResult<"account.byIdOld">;
};

const InnerAccountDetail = React.memo<QueryProps>(({ query }) => {
  const { t } = useTranslation();
  switch (query.status) {
    case "loading":
    case "idle":
      return <Spinner animation="border" />;
    case "success":
      if (!query.data) {
        return <>{t("page.accounts.error.account_not_found")}</>;
      }
      return (
        <>
          <AccountDetails account={query.data} />
          <ContractDetails accountId={query.data.accountId} />
          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("common.transactions.transactions")}</h2>}
            className="p-0"
          >
            <AccountTransactions accountId={query.data.accountId} />
          </Content>
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
        <InnerAccountDetail query={accountQuery} />
      </Content>
    </>
  );
});

export const getServerSideProps: GetServerSideProps<
  {},
  { slug: string[] }
> = async (context) => {
  if (getBetaOptionsFromReq(context.req)?.enabled) {
    return getBetaServerSideProps({
      ...context,
      // We explicitly set noPrefix to true to disable /beta prefixes on non-beta page
      query: { ...context.query, noPrefix: "true" },
    });
  }
  const accountId = context.params?.slug[0] ?? "";
  if (/[A-Z]/.test(accountId)) {
    return {
      redirect: {
        permanent: true,
        destination: `/accounts/${accountId.toLowerCase()}${`?${stringify(
          context.query
        )}`}`,
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
