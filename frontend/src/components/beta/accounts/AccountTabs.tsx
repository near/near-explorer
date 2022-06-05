import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";
import { Tabs } from "../common/Tabs";
import { Account } from "../../../types/common";
import AccountActivityView from "./AccountActivityView";
import {
  BasicDecimalPower,
  BASIC_DENOMINATION,
  formatToPowerOfTen,
} from "../../../libraries/formatting";

type Props = {
  account: Account;
};

const TabLabel = styled("div", {
  display: "flex",
});

const TabDetails = styled("div", {
  fontSize: 10,
  lineHeight: "150%",
});

const AccountTabs: React.FC<Props> = React.memo((props) => {
  const { t } = useTranslation();
  const transactionsQuantity = formatToPowerOfTen<BasicDecimalPower>(
    props.account.transactionsQuantity.toString(),
    6
  );
  return (
    <Tabs
      tabs={[
        {
          id: "activity",
          label: (
            <TabLabel>
              {t("pages.account.tabs.activity")}
              <TabDetails>
                {t("pages.account.tabs.activityDetails", {
                  transactionsQuantity: `${transactionsQuantity.quotient}${
                    BASIC_DENOMINATION[transactionsQuantity.prefix]
                  }`,
                })}
              </TabDetails>
            </TabLabel>
          ),
          node: <AccountActivityView accountId={props.account.id} />,
        },
        {
          id: "tokens",
          disabled: true,
          label: <TabLabel>{t("pages.account.tabs.tokens")}</TabLabel>,
          node: null,
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
