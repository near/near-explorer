import Link from "next/link";

export interface Props {
  accountId: string;
  children?: React.ReactNode;
}

export default ({ accountId, children }: Props) => (
  <Link href="/accounts/[id]" as={`/accounts/${accountId}`}>
    <a className="account-link">{children || `@${accountId}`}</a>
  </Link>
);
