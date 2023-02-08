import Head from "next/head";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { GetServerSideProps, NextPage } from "next";

import { TRPCQueryResult } from "@explorer/common/types/trpc";
import { useAnalyticsTrackOnMount } from "@explorer/frontend/hooks/analytics/use-analytics-track-on-mount";

import AccountHeader from "@explorer/frontend/components/beta/accounts/AccountHeader";
import AccountTabs from "@explorer/frontend/components/beta/accounts/AccountTabs";
import { trpc } from "@explorer/frontend/libraries/trpc";
import { styled } from "@explorer/frontend/libraries/styles";
import {
  useAccountPageOptions,
  parseAccountSlug,
  AccountPageOptions,
  buildAccountUrl,
} from "@explorer/frontend/hooks/use-account-page-options";
import { Spinner } from "react-bootstrap";
import ErrorMessage from "@explorer/frontend/components/utils/ErrorMessage";

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
    "account.byId",
    { id: options.accountId },
  ]);

  return (
    <>
      <Head>
        <title>NEAR Explorer Beta | Account</title>
      </Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;500;700&display=swap"
        rel="stylesheet"
      />
      <Wrapper>
        <AccountQueryView query={accountQuery} options={options} />
      </Wrapper>
    </>
  );
});

type QueryProps = {
  query: TRPCQueryResult<"account.byId">;
  options: AccountPageOptions;
};

const AccountQueryView: React.FC<QueryProps> = React.memo((props) => {
  const { t } = useTranslation();
  switch (props.query.status) {
    case "success":
      if (props.query.data) {
        return (
          <>
            <AccountHeader account={props.query.data} />
            <AccountTabs account={props.query.data} options={props.options} />
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
        <ErrorMessage onRetry={props.query.refetch}>
          {props.query.error.message}
        </ErrorMessage>
      );
    case "loading":
      return <Spinner animation="border" />;
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
