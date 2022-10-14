import Head from "next/head";
import { useRouter } from "next/router";

import { Container } from "react-bootstrap";

import AccountDetails from "../../../components/accounts/AccountDetails";
import ContractDetails from "../../../components/contracts/ContractDetails";
import Transactions, {
  getNextPageParam,
} from "../../../components/transactions/Transactions";
import Content from "../../../components/utils/Content";

import TransactionIconSvg from "../../../../public/static/images/icon-t-transactions.svg";

import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../../hooks/analytics/use-analytics-track-on-mount";
import { trpc } from "../../../libraries/trpc";
import { styled } from "../../../libraries/styles";
import * as React from "react";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

const TRANSACTIONS_PER_PAGE = 10;

const AccountDetail: NextPage = React.memo(() => {
  const accountId = useRouter().query.id as string;
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Account", {
    accountId,
  });
  const accountQuery = trpc.useQuery(["account.byIdOld", { id: accountId }]);
  const query = trpc.useInfiniteQuery(
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
        {accountQuery.status === "success" ? (
          accountQuery.data ? (
            <AccountDetails account={accountQuery.data} />
          ) : (
            t("page.accounts.error.account_not_found", {
              account_id: accountId,
            })
          )
        ) : (
          t("page.accounts.error.account_fetching", {
            account_id: accountId,
          })
        )}
      </Content>
      {!accountQuery.data ? null : (
        <>
          <Container>
            <ContractDetails accountId={accountId} />
          </Container>
          <Content
            icon={<TransactionIcon />}
            title={<h2>{t("common.transactions.transactions")}</h2>}
          >
            <Transactions query={query} />
          </Content>
        </>
      )}
    </>
  );
});

export const getServerSideProps: GetServerSideProps<
  {},
  { id: string }
> = async ({ params }) => {
  const accountId = params?.id ?? "";
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

export default AccountDetail;
