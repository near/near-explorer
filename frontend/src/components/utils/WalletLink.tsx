import { truncateAccountId } from "../../libraries/formatting";

export interface Props {
  accountId: string;
  nearWalletProfilePrefix: string;
}

const WalletLink = ({ accountId, nearWalletProfilePrefix }: Props) => {
  return (
    <>
      <a
        target="_blank"
        rel="noopener"
        className="account-link"
        href={`${nearWalletProfilePrefix}/${accountId}`}
      >
        {`${truncateAccountId(accountId, 20)} on Wallet`}
      </a>
      <style jsx>{`
        .account-link {
          white-space: nowrap;
        }
      `}</style>
    </>
  );
};

export default WalletLink;
