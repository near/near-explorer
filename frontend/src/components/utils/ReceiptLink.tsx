import { styled } from "../../libraries/styles";
import Link from "./Link";

const DisabledLink = styled("span", {
  color: "#24272a",
});

export interface Props {
  transactionHash?: string | null;
  receiptId: string;
  truncate?: boolean;
  children?: React.ReactNode;
}

const ReceiptLink = ({
  transactionHash,
  receiptId,
  truncate = true,
  children,
}: Props) => {
  return (
    <>
      {!transactionHash ? (
        <DisabledLink title={receiptId}>
          {children ||
            (truncate ? `${receiptId.substring(0, 7)}...` : receiptId)}
        </DisabledLink>
      ) : (
        <Link
          href="/transactions/[hash]"
          as={`/transactions/${transactionHash}#${receiptId}`}
        >
          <a>
            {children ||
              (truncate ? `${receiptId.substring(0, 7)}...` : receiptId)}
          </a>
        </Link>
      )}
    </>
  );
};

export default ReceiptLink;
