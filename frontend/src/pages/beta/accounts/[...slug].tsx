import * as React from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { Spinner } from "react-bootstrap";

import { TRPCQueryResult } from "@/common/types/trpc";
import { AccountHeader } from "@/frontend/components/beta/accounts/AccountHeader";
import { AccountTabs } from "@/frontend/components/beta/accounts/AccountTabs";
import { ErrorMessage } from "@/frontend/components/utils/ErrorMessage";
import { useAnalyticsTrackOnMount } from "@/frontend/hooks/analytics/use-analytics-track-on-mount";
import {
  useAccountPageOptions,
  parseAccountSlug,
  AccountPageOptions,
  buildAccountUrl,
} from "@/frontend/hooks/use-account-page-options";
import { styled } from "@/frontend/libraries/styles";
import { trpc } from "@/frontend/libraries/trpc";

const Wrapper = styled("div", {
  backgroundColor: "#fff",
  padding: "12px 6vw",
});

type QueryProps = {
  query: TRPCQueryResult<"account.byId">;
  options: AccountPageOptions;
};

const AccountQueryView: React.FC<QueryProps> = React.memo(
  ({ query, options }) => {
    const { t } = useTranslation();
    switch (query.status) {
      case "success":
        if (!query.data) {
          return <>{t("page.accounts.error.account_not_found")}</>;
        }
        return (
          <>
            <AccountHeader account={query.data} />
            <AccountTabs account={query.data} options={options} />
          </>
        );
      case "error":
        return (
          <ErrorMessage onRetry={query.refetch}>
            {query.error.message}
          </ErrorMessage>
        );
      case "loading":
        return <Spinner animation="border" />;
      default:
        return null;
    }
  }
);

const AccountPage: NextPage = React.memo(() => {
  const options = useAccountPageOptions();
  useAnalyticsTrackOnMount("Explorer Beta | Account Page", {
    accountId: options.accountId,
  });
  const accountQuery = trpc.account.byId.useQuery({ id: options.accountId });

  return (
    <>
      <Head>
        <title>NEAR Explorer Beta | Account</title>
      </Head>
      <Wrapper>
        <AccountQueryView query={accountQuery} options={options} />
      </Wrapper>
    </>
  );
});

export const getServerSideProps: GetServerSideProps<
  {},
  { slug: string[] }
> = async ({ params, query }) => {
  try {
    const options = parseAccountSlug(!query.noPrefix, params?.slug ?? []);
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
