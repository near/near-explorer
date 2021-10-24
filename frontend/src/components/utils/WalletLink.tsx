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
    <Translate>
      {({ translate }) => (
        <span onClick={clicked}>
          <a
            target="_blank"
            rel="noopener"
            className="account-link"
            href={`${nearWalletProfilePrefix}/${accountId}`}
          >
            {`${truncateAccountId(accountId, 20)} ${translate(
              "utils.WalletLink.on"
            )} Wallet`}
          </a>
          <style jsx>{`
            .account-link {
              white-space: nowrap;
            }
          `}</style>
        </span>
      )}
    </Translate>
  );
};

export default WalletLink;
