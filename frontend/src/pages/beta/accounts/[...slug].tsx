import Head from "next/head";

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
import {
  useAccountPageOptions,
  parseAccountSlug,
  AccountPageOptions,
  buildAccountUrl,
} from "../../../hooks/use-account-page-options";

const Wrapper = styled("div", {
  backgroundColor: "#fff",
  padding: "12px 6vw",
});

const AccountPage: NextPage = React.memo(() => {
  const options = useAccountPageOptions();
  useAnalyticsTrackOnMount("Explorer Beta | Account Page", {
    accountId: options.accountId,
  });
  const accountQuery = trpc.useQuery([
    "account",
    { accountId: options.accountId },
  ]);

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
        <AccountQueryView {...accountQuery} options={options} />
      </Wrapper>
    </>
  );
});

type QueryProps = ReactQuery.UseQueryResult<Account | null> & {
  options: AccountPageOptions;
};

const AccountQueryView: React.FC<QueryProps> = React.memo((props) => {
  const { t } = useTranslation();
  switch (props.status) {
    case "success":
      if (props.data) {
        return (
          <>
            <AccountHeader account={props.data} />
            <AccountTabs account={props.data} options={props.options} />
          </>
        );
      }
      return (
        <div>
          {t("page.accounts.error.account_not_found", {
            account_id: props.options.accountId,
          })}
        </div>
      );
    case "error":
      return (
        <div>
          {t("page.accounts.error.account_fetching", {
            account_id: props.options.accountId,
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
  { slug: string[] }
> = async ({ params }) => {
  try {
    const options = parseAccountSlug(params?.slug ?? []);
    if (/[A-Z]/.test(options.accountId)) {
      return {
        redirect: {
          permanent: true,
          destination: buildAccountUrl({
            ...options,
            accountId: options.accountId.toLowerCase(),
          }),
        },
      };
    }
    return { props: {} };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default AccountPage;
