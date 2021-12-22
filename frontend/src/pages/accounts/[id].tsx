import Head from "next/head";

import { Container } from "react-bootstrap";

import AccountsApi, { Account } from "../../libraries/explorer-wamp/accounts";

import AccountDetails from "../../components/accounts/AccountDetails";
import ContractDetails from "../../components/contracts/ContractDetails";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import { Translate } from "react-localize-redux";
import { GetServerSideProps, NextPage } from "next";
import { useNearNetwork } from "../../hooks/use-near-network";
import { useAnalyticsTrackOnMount } from "../../hooks/analytics/use-analytics-track-on-mount";

interface Props {
  account:
    | Account
    | {
        accountId: string;
      };
  accountFetchingError?: unknown;
  accountError?: unknown;
}

const AccountDetail: NextPage<Props> = ({
  account,
  accountError,
  accountFetchingError,
}) => {
  const { currentNetwork } = useNearNetwork();
  useAnalyticsTrackOnMount("Explorer View Individual Account", {
    accountId: account.accountId,
  });

  return (
    <>
      <Head>
        <title>NEAR Explorer | Account</title>
      </Head>
      <Content
        title={
          <h1>
            <Translate id="common.accounts.account" />
            {`: @${account.accountId}`}
          </h1>
        }
        border={false}
      >
        {accountError ? (
          <Translate
            id="page.accounts.error.account_not_found"
            data={{ account_id: account.accountId }}
          />
        ) : accountFetchingError ? (
          <Translate
            id="page.accounts.error.account_fetching"
            data={{ account_id: account.accountId }}
          />
        ) : (
          <AccountDetails
            account={account}
            currentNearNetwork={currentNetwork}
          />
        )}
      </Content>
      {accountError || accountFetchingError ? null : (
        <>
          <Container>
            <ContractDetails accountId={account.accountId} />
          </Container>
          <Content
            size="medium"
            icon={<TransactionIcon style={{ width: "22px" }} />}
            title={
              <h2>
                <Translate id="common.transactions.transactions" />
              </h2>
            }
          >
            <Transactions accountId={account.accountId} count={10} />
          </Content>
        </>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async ({ req, params, res }) => {
  const id = params!.id;
  if (/[A-Z]/.test(id) && res) {
    return {
      redirect: {
        permanent: true,
        destination: `/accounts/${id.toLowerCase()}`,
      },
    };
  }

  try {
    const isAccountExist = await new AccountsApi(req).isAccountIndexed(id);
    if (isAccountExist) {
      try {
        const account = await new AccountsApi(req).getAccountInfo(id);
        return {
          props: { account },
        };
      } catch (accountFetchingError) {
        return {
          props: {
            account: { accountId: id },
            accountFetchingError,
          },
        };
      }
    }
  } catch (accountError) {
    return {
      props: {
        account: { accountId: id },
        accountError,
      },
    };
  }
  return {
    props: {
      account: { accountId: id },
    },
  };
};

export default AccountDetail;
