import { truncateAccountId } from "../../libraries/formatting";
import { Mixpanel } from "../../libraries/mixpanel";

export interface Props {
  accountId: string;
  nearWalletProfilePrefix: string;
}

const WalletLink = ({ accountId, nearWalletProfilePrefix }: Props) => {
  const clicked = () =>
    Mixpanel.track("Click for wallet profile", {
      accountId: accountId,
      walletPrefix: nearWalletProfilePrefix,
    });
  return (
    <div onClick={clicked}>
      <a
        target="_blank"
        rel="noopener"
        className="account-link"
        href={`${nearWalletProfilePrefix}/${accountId}`}
      >
        {`${truncateAccountId(accountId)} on Wallet`}
      </a>
      <style jsx>{`
        .account-link {
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default WalletLink;
