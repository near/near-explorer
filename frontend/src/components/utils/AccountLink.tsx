import Link from "next/link";

export interface Props {
  accountId: string;
}

export default ({ accountId }: Props) => {
  return (
    <Link href="/accounts/[id]" as={`/accounts/${accountId}`}>
      <a className="account-link">{truncateAccountId(accountId)}</a>
    </Link>
  );
};

export function truncateAccountId(
  accountId: string,
  lengthThreshold: number = 25
) {
  return accountId.length > lengthThreshold
    ? accountId.slice(0, 5) + ". . ." + accountId.slice(accountId.length - 15)
    : accountId;
}
