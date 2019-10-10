import Link from "next/link";

export interface Props {
  accountId: string;
}

export default ({ accountId }: Props) => (
  <Link href="/accounts/[id]" as={`/accounts/${accountId}`}>
    <a className="account-link">{`@${accountId}`}</a>
  </Link>
);
