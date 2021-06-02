import Link from "./Link";

export interface Props {
  transactionHash?: string | null;
  receiptId: string;
  children?: React.ReactNode;
}

const ReceiptLink = ({ transactionHash, receiptId, children }: Props) => {
  return (
    <>
      {!transactionHash ? (
        <span className="receipt-hash-link disabled" title={receiptId}>
          {children || `${receiptId.substring(0, 7)}...`}
        </span>
      ) : (
        <Link
          href="/transactions/[hash]"
          as={`/transactions/${transactionHash}#${receiptId}`}
        >
          <a className="receipt-hash-link">
            {children || `${receiptId.substring(0, 7)}...`}
          </a>
        </Link>
      )}
      <style global jsx>{`
        .receipt-hash-link.disabled {
          cursor: default;
          color: #24272a;
        }
      `}</style>
    </>
  );
};

export default ReceiptLink;
