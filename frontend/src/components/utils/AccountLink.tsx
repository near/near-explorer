import Link from "next/link";

export interface Props {
  accountId: string;
}

export default ({ accountId }: Props) => {
  let Id =
    accountId.length > 25
      ? accountId.slice(0, 8) + "..." + accountId.slice(accountId.length - 7)
      : accountId;
  return (
    <Link href="/accounts/[id]" as={`/accounts/${accountId}`}>
      <a className="account-link">{Id}</a>
    </Link>
  );
};
