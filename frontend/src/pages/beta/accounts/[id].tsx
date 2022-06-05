import Head from "next/head";
import { useRouter } from "next/router";

import * as React from "react";
import * as ReactQuery from "react-query";
import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";

import { Account } from "../../../types/common";
import { useAnalyticsTrackOnMount } from "../../../hooks/analytics/use-analytics-track-on-mount";

import AccountHeader from "../../../components/beta/accounts/AccountHeader";
import AccountTabs from "../../../components/beta/accounts/AccountTabs";
import { trpc } from "../../../libraries/trpc";
import { styled } from "../../../libraries/styles";

const Wrapper = styled("div", {
  backgroundColor: "#fff",
  padding: "12px 6em",
});

const AccountPage: NextPage = React.memo(() => {
  const accountId = useRouter().query.id as string;
  useAnalyticsTrackOnMount("Explorer Beta | Account Page", {
    accountId,
  });
  const accountQuery = trpc.useQuery(["account", { accountId }]);

  return (
    <>
      <Head>
        <title>NEAR Explorer Beta | Account</title>
      </Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope&display=swap"
        rel="stylesheet"
      />
      <Wrapper>
        <AccountQueryView {...accountQuery} id={accountId} />
      </Wrapper>
    </>
  );
});

type QueryProps = ReactQuery.UseQueryResult<Account | null> & {
  id: string;
};

const AccountQueryView: React.FC<QueryProps> = React.memo((props) => {
  const { t } = useTranslation();
  switch (props.status) {
    case "success":
      if (props.data) {
        return (
          <>
            <AccountHeader account={props.data} />
            <AccountTabs />
          </>
        );
      }
      return (
        <div>
          {t("page.accounts.error.account_not_found", {
            account_id: props.id,
          })}
        </div>
      );
    case "error":
      return (
        <div>
          {t("page.accounts.error.account_fetching", {
            account_id: props.id,
          })}
        </div>
      );
    case "loading":
      return <div>Loading...</div>;
    default:
      return null;
  }
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

export default AccountPage;
