import Head from "next/head";

import { useEffect } from "react";
import { Container } from "react-bootstrap";

import Mixpanel from "../../libraries/mixpanel";
import AccountsApi, { Account } from "../../libraries/explorer-wamp/accounts";

import AccountDetails from "../../components/accounts/AccountDetails";
import ContractDetails from "../../components/contracts/ContractDetails";
import Transactions from "../../components/transactions/Transactions";
import Content from "../../components/utils/Content";

import TransactionIcon from "../../../public/static/images/icon-t-transactions.svg";

import { Translate } from "react-localize-redux";
import { NextPage } from "next";
import { useNearNetwork } from "src/hooks/use-near-network";

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
  useEffect(() => {
    Mixpanel.track("Explorer View Individual Account", {
      accountId: account.accountId,
    });
  }, []);

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

AccountDetail.getInitialProps = async ({ req, query: { id: rawId }, res }) => {
  const id = rawId as string;
  if (/[A-Z]/.test(id) && res) {
    res.writeHead(301, { Location: `/accounts/${id.toLowerCase()}` });
    res.end();
  }

  try {
    const isAccountExist = await new AccountsApi(req).isAccountIndexed(id);
    if (isAccountExist) {
      try {
        const account = await new AccountsApi(req).getAccountInfo(id);
        return { account };
      } catch (accountFetchingError) {
        return {
          account: { accountId: id },
          accountFetchingError,
        };
      }
    }
  } catch (accountError) {
    return {
      account: { accountId: id },
      accountError,
    };
  }
  return {
    account: { accountId: id },
  };
};

export default AccountDetail;
