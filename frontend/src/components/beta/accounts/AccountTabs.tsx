import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  AccountPageOptions,
  AccountTab,
  buildAccountUrl,
} from "../../../hooks/use-account-page-options";
import { styled } from "../../../libraries/styles";
import { Tabs } from "../common/Tabs";
import AccountFungibleTokens from "./AccountFungibleTokens";

const TabLabel = styled("div", {
  display: "flex",
});

type Props = { options: AccountPageOptions };

const AccountTabs: React.FC<Props> = React.memo(({ options }) => {
  const { t } = useTranslation();
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
          id: "activity",
          disabled: true,
          label: <TabLabel>{t("pages.account.tabs.activity")}</TabLabel>,
          node: null,
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
          disabled: true,
          label: <TabLabel>{t("pages.account.tabs.collectibles")}</TabLabel>,
          node: null,
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
