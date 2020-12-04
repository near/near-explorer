import Link from "next/link";

export interface Props {
  accountId: string;
  nearWalletProfilePrefix: string;
}

const WalletLink = ({ accountId, nearWalletProfilePrefix }: Props) => {
  return (
    <>
      <Link href={`${nearWalletProfilePrefix}/[id]`} as={`${nearWalletProfilePrefix}/${accountId}`}>
        <a target="_blank" className="account-link">{truncateAccountId(accountId)}</a>
      </Link>
      <style jsx>{`
        .account-link {
          white-space: nowrap;
        }
      `}</style>
    </>
  );
};

export default WalletLink;

export function truncateAccountId(
  accountId: string,
  lengthThreshold: number = 25
) {
  return accountId.length > lengthThreshold
    ? accountId.slice(0, 5) + "…" + accountId.slice(accountId.length - 15)
    : accountId;
}
