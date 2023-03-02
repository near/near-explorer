import * as React from "react";

import { useTranslation } from "next-i18next";

import { Account } from "@explorer/common/types/procedures";
import AccountFungibleTokens from "@explorer/frontend/components/beta/accounts/AccountFungibleTokens";
import AccountNonFungibleTokensView from "@explorer/frontend/components/beta/accounts/AccountNonFungibleTokens";
import AccountTransactionsView from "@explorer/frontend/components/beta/accounts/AccountTransactionsView";
import { Tabs } from "@explorer/frontend/components/beta/common/Tabs";
import {
  AccountPageOptions,
  AccountTab,
  buildAccountUrl,
} from "@explorer/frontend/hooks/use-account-page-options";
import {
  BasicDecimalPower,
  BASIC_DENOMINATION,
  formatToPowerOfTen,
} from "@explorer/frontend/libraries/formatting";
import { styled } from "@explorer/frontend/libraries/styles";
import { trpc } from "@explorer/frontend/libraries/trpc";

const TabLabel = styled("div", {
  display: "flex",
});

type Props = { account: Account; options: AccountPageOptions };

const TabDetails = styled("div", {
  fontSize: 10,
  lineHeight: "150%",
});

const AccountTabs: React.FC<Props> = React.memo(({ account, options }) => {
  const { t } = useTranslation();
  const transactionsQuantity =
    account.transactionsQuantity === undefined
      ? undefined
      : formatToPowerOfTen<BasicDecimalPower>(
          account.transactionsQuantity.toString(),
          6
        );
  const collectiblesCount = trpc.useQuery([
    "account.nonFungibleTokensCount",
    { accountId: options.accountId },
  ]);

  const collectiblesQuantity = collectiblesCount.data
    ? formatToPowerOfTen<BasicDecimalPower>(
        collectiblesCount.data.toString(),
        6
      )
    : null;

  return (
    <Tabs<AccountTab>
      buildHref={React.useCallback(
        (tab: AccountTab) =>
          buildAccountUrl({ accountId: options.accountId, tab }),
        [options.accountId]
      )}
      initialSelectedId={options.tab}
      tabs={[
        {
          id: "transactions",
          label: (
            <TabLabel>
              {t("pages.account.tabs.transactions")}
              {transactionsQuantity === undefined ? undefined : (
                <TabDetails>
                  {t("pages.account.tabs.transactionsQuantity", {
                    quantity: `${transactionsQuantity.quotient}${
                      BASIC_DENOMINATION[transactionsQuantity.prefix]
                    }`,
                  })}
                </TabDetails>
              )}
            </TabLabel>
          ),
          node: <AccountTransactionsView accountId={options.accountId} />,
        },
        {
          id: "fungible-tokens",
          label: <TabLabel>{t("pages.account.tabs.tokens")}</TabLabel>,
          node:
            options.tab === "fungible-tokens" ? (
              <AccountFungibleTokens options={options} />
            ) : null,
        },
        {
          id: "collectibles",
          label: (
            <TabLabel>
              {t("pages.account.tabs.collectibles")}
              {collectiblesQuantity ? (
                <TabDetails>
                  {t("pages.account.tabs.collectiblesQuantity", {
                    quantity: `${collectiblesQuantity.quotient}${
                      BASIC_DENOMINATION[collectiblesQuantity.prefix]
                    }`,
                  })}
                </TabDetails>
              ) : null}
            </TabLabel>
          ),
          node:
            options.tab === "collectibles" ? (
              <AccountNonFungibleTokensView options={options} />
            ) : null,
        },
        {
          id: "access-keys",
          disabled: true,
          label: <TabLabel>{t("pages.account.tabs.accessKeys")}</TabLabel>,
          node: null,
        },
        {
          id: "locked-up",
          disabled: true,
          label: <TabLabel>{t("pages.account.tabs.lockedUp")}</TabLabel>,
          node: null,
        },
      ]}
    />
  );
});

export default AccountTabs;
