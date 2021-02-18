import Link from "../utils/Link";

export interface Props {
  transactionHash: string;
  children?: React.ReactNode;
}

export default ({ transactionHash, children }: Props) => (
  <Link href="/transactions/[hash]" as={`/transactions/${transactionHash}`}>
    <a className="transaction-link">
      {children || `${transactionHash.substring(0, 7)}...`}
    </a>
  </Link>
);
