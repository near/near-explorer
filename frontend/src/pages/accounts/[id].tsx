import Head from "next/head";

import { Container } from "react-bootstrap";

import AccountDetails from "../../components/accounts/AccountDetails";
import ContractDetails from "../../components/contracts/ContractDetails";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

import TransactionIconSvg from "../../../public/static/images/icon-t-transactions.svg";

import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";
import wampApi from "../../libraries/wamp/api";
import { getNearNetwork } from "../../libraries/config";
import { Account, getAccount } from "../../providers/accounts";
import { styled } from "../../libraries/styles";

const TransactionIcon = styled(TransactionIconSvg, {
  width: 22,
});

interface Props {
  accountId: string;
  account?: Account;
  accountFetchingError?: unknown;
  accountError?: unknown;
}

const AccountDetail: NextPage<Props> = ({
  accountId,
  account,
  accountError,
  accountFetchingError,
}) => {
  const { t } = useTranslation();
  useAnalyticsTrackOnMount("Explorer View Individual Account", {
    accountId,
  });

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
            <Transactions accountId={accountId} count={10} />
          </Content>
        </>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async ({ req, params }) => {
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
    const currentNetwork = getNearNetwork(req);
    const wampCall = wampApi.getCall(currentNetwork);
    const isAccountExist = await wampCall("is-account-indexed", [accountId]);
    if (isAccountExist) {
      try {
        return {
          props: {
            ...commonProps,
            account: await getAccount(wampCall, accountId),
          },
        };
      } catch (accountFetchingError) {
        return {
          props: {
            ...commonProps,
            accountFetchingError,
          },
        };
      }
    }
    return {
      props: {
        accountId,
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
