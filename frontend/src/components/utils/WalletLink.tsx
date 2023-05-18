import * as React from "react";

import { useTranslation } from "next-i18next";

import { useAnalyticsTrack } from "@/frontend/hooks/analytics/use-analytics-track";
import { truncateAccountId } from "@/frontend/libraries/formatting";
import { styled } from "@/frontend/libraries/styles";

const AccountLink = styled("a", {
  whiteSpace: "nowrap",
});

export interface Props {
  accountId: string;
  nearWalletProfilePrefix: string;
}

const WalletLink: React.FC<Props> = React.memo(
  ({ accountId, nearWalletProfilePrefix }) => {
    const { t } = useTranslation();
    const track = useAnalyticsTrack();
    return (
      <AccountLink
        target="_blank"
        rel="noopener"
        href={`${nearWalletProfilePrefix}/${accountId}`}
        onClick={() =>
          track("Explorer Click for wallet profile", {
            accountId,
            walletPrefix: nearWalletProfilePrefix,
          })
        }
      >
        {t("utils.WalletLink", {
          account_id: truncateAccountId(accountId, 20).toString(),
          wallet_name: "Wallet",
        })}
      </AccountLink>
    );
  }
);

export default WalletLink;
