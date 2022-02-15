import Link from "../utils/Link";

export interface Props {
  transactionHash: string;
  children?: React.ReactNode;
}

const TransactionLink = ({ transactionHash, children }: Props) => (
  <Link href="/transactions/[hash]" as={`/transactions/${transactionHash}`}>
    <a>{children || `${transactionHash.substring(0, 7)}...`}</a>
  </Link>
);

export default TransactionLink;
