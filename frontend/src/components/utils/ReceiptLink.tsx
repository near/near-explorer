import Link from "./Link";

export interface Props {
  transactionHash?: string | null;
  receiptId: string;
  trancate?: boolean;
  children?: React.ReactNode;
}

const ReceiptLink = ({
  transactionHash,
  receiptId,
  trancate = true,
  children,
}: Props) => {
  return (
    <>
      {!transactionHash ? (
        <span className="receipt-hash-link disabled" title={receiptId}>
          {children ||
            (trancate ? `${receiptId.substring(0, 7)}...` : receiptId)}
        </span>
      ) : (
        <Link
          href="/transactions/[hash]"
          as={`/transactions/${transactionHash}#${receiptId}`}
        >
          <a className="receipt-hash-link">
            {children ||
              (trancate ? `${receiptId.substring(0, 7)}...` : receiptId)}
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
