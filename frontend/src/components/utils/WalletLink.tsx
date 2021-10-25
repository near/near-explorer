import { Translate } from "react-localize-redux";
import { truncateAccountId } from "../../libraries/formatting";
import Mixpanel from "../../libraries/mixpanel";

export interface Props {
  accountId: string;
  nearWalletProfilePrefix: string;
}

const WalletLink = ({ accountId, nearWalletProfilePrefix }: Props) => {
  const clicked = () =>
    Mixpanel.track("Explorer Click for wallet profile", {
      accountId: accountId,
      walletPrefix: nearWalletProfilePrefix,
    });
  return (
    <span onClick={clicked}>
      <a
        target="_blank"
        rel="noopener"
        className="account-link"
        href={`${nearWalletProfilePrefix}/${accountId}`}
      >
        <Translate
          id="utils.WalletLink"
          data={{
            account_id: truncateAccountId(accountId, 20).toString(),
            wallet_name: "Wallet",
          }}
        />
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
