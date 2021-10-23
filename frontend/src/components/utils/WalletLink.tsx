import { truncateAccountId } from "../../libraries/formatting";
import Mixpanel from "../../libraries/mixpanel";
import { Translate } from "react-localize-redux";

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
        {`${truncateAccountId(accountId, 20)}`}
        <Translate>
          {({ translate }) =>
            translate("component.stats.WalletLink.on_wallet").toString()
          }
        </Translate>
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
