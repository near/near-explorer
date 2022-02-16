import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";
import { truncateAccountId } from "../../libraries/formatting";
import { styled } from "../../libraries/styles";

const AccountLink = styled("a", {
  whiteSpace: "nowrap",
});

export interface Props {
  accountId: string;
  nearWalletProfilePrefix: string;
}

const WalletLink: FC<Props> = ({ accountId, nearWalletProfilePrefix }) => {
  const { t } = useTranslation();
  const track = useAnalyticsTrack();
  return (
    <span
      onClick={() =>
        track("Explorer Click for wallet profile", {
          accountId: accountId,
          walletPrefix: nearWalletProfilePrefix,
        })
      }
    >
      <AccountLink
        target="_blank"
        rel="noopener"
        href={`${nearWalletProfilePrefix}/${accountId}`}
      >
        {t("utils.WalletLink", {
          account_id: truncateAccountId(accountId, 20).toString(),
          wallet_name: "Wallet",
        })}
      </AccountLink>
    </span>
  );
};

export default WalletLink;
