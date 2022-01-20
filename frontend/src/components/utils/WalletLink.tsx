import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";
import { truncateAccountId } from "../../libraries/formatting";

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
      <a
        target="_blank"
        rel="noopener"
        className="account-link"
        href={`${nearWalletProfilePrefix}/${accountId}`}
      >
        {t("utils.WalletLink", {
          account_id: truncateAccountId(accountId, 20).toString(),
          wallet_name: "Wallet",
        })}
      </a>
      <style jsx>{`
        .account-link {
          white-space: nowrap;
        }
      `}</style>
    </span>
  );
};

export default WalletLink;
