import Head from "next/head";

import { Container } from "react-bootstrap";

import AccountDetails from "../../components/accounts/AccountDetails";
import ContractDetails from "../../components/contracts/ContractDetails";
import Transactions, {
  Props as TransactionsProps,
} from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

import TransactionIconSvg from "../../../public/static/images/icon-t-transactions.svg";

import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import { getFetcher } from "../../libraries/transport";
import { getNearNetworkName } from "../../libraries/config";
import { Account } from "../../types/common";
import { styled } from "../../libraries/styles";
import * as React from "react";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

interface Props {
  accountId: string;
  account?: Account;
  accountFetchingError?: unknown;
  accountError?: unknown;
}

const TRANSACTIONS_PER_PAGE = 10;

const AccountDetail: NextPage<Props> = React.memo(
  ({ accountId, account, accountError, accountFetchingError }) => {
    const { t } = useTranslation();
    useAnalyticsTrackOnMount("Explorer View Individual Account", {
      accountId,
    });
    const fetch = React.useCallback<TransactionsProps["fetch"]>(
      (fetcher, indexer) =>
        fetcher("transactions-list-by-account-id", [
          accountId,
          TRANSACTIONS_PER_PAGE,
          indexer ?? null,
        ]),
      [accountId]
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
          {account ? (
            <AccountDetails account={account} />
          ) : accountError ? (
            t("page.accounts.error.account_not_found", {
              account_id: accountId,
            })
          ) : (
            t("page.accounts.error.account_fetching", {
              account_id: accountId,
            })
          )}
        </Content>
        {accountError || accountFetchingError ? null : (
          <>
            <Container>
              <ContractDetails accountId={accountId} />
            </Container>
            <Content
              icon={<TransactionIcon />}
              title={<h2>{t("common.transactions.transactions")}</h2>}
            >
              <Transactions fetch={fetch} />
            </Content>
          </>
        )}
      </>
    );
  }
);

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async ({ req, params, query }) => {
  const accountId = params?.id ?? "";
  if (/[A-Z]/.test(accountId)) {
    return {
      redirect: {
        permanent: true,
        destination: `/accounts/${accountId.toLowerCase()}`,
      },
    };
  }
  const commonProps = {
    accountId,
  };

  try {
    const networkName = getNearNetworkName(query, req.headers.host);
    const fetcher = getFetcher(networkName);
    const maybeAccount = await fetcher("account-info", [accountId]);
    if (maybeAccount) {
      return {
        props: {
          ...commonProps,
          account: maybeAccount,
        },
      };
    }
    return {
      props: {
        ...commonProps,
        accountError: `Account ${accountId} does not exist`,
      },
    };
  } catch (accountError) {
    return {
      props: {
        ...commonProps,
        accountFetchingError: String(accountError),
      },
    };
  }
};

export default AccountDetail;
