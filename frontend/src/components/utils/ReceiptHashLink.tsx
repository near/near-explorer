import Link from "../utils/Link";

export interface Props {
  transactionHash: string;
  receiptId: string;
  children?: React.ReactNode;
}

const ReceiptHashLink = ({ transactionHash, receiptId, children }: Props) => {
  return (
    <>
      {!transactionHash ? (
        <a className="receipt-hash-link disabled" title={receiptId}>
          {children || `${receiptId.substring(0, 7)}...`}
        </a>
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
          touch-action: none;
          pointer-events: none;
          cursor: default;
          color: #24272a;
        }
      `}</style>
    </>
  );
};

export default ReceiptHashLink;
