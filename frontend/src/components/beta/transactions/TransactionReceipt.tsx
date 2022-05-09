import * as React from "react";
import { TransactionReceipt as TxReceipt } from "../../../types/transaction";
import { styled } from "../../../libraries/styles";

import TransactionType from "./TransactionType";

type Props = {
  receipt: TxReceipt;
  senderIsReceiver?: boolean;
};

const ReceiptWrapper = styled("div", {
  position: "relative",
});

const Author = styled("div", {
  display: "flex",
  color: "#3f4246",
  fontWeight: 500,
  fontSize: "$font-m",
  lineHeight: "150%",
});

const Avatar = styled("div", {
  size: "$avatarSizeSmall",
  backgroundColor: "$avatarFallback",
  opacity: 0.2,
  borderRadius: "$round",
  marginRight: "$space-s",
});

const ActionItems = styled("div", {
  position: "relative",
  paddingLeft: 18,
  borderLeft: "1px solid rgba(0, 0, 0, .2)",
  marginLeft: "8.5px",
  marginVertical: 10,

  "&::after": {
    zIndex: 1,
    display: "block",
    content: "",
    position: "absolute",
    width: 5,
    height: 5,
    bottom: 0,
    left: "-3px",
    borderLeft: "1px solid rgba(0, 0, 0, .2)",
    borderTop: "1px solid rgba(0, 0, 0, .2)",
    transform: "rotate(225deg)",
  },
});

const ExecutedReceiptRow = styled(ActionItems);

const TransactionReceipt: React.FC<Props> = React.memo(
  ({ receipt, senderIsReceiver }) => {
    return (
      <ReceiptWrapper>
        {!senderIsReceiver ? (
          <Author>
            <Avatar />
            <span>{receipt.signerId}</span>
          </Author>
        ) : null}

        <ActionItems>
          <TransactionType
            actions={receipt.actions}
            signerId={receipt.signerId}
          />
        </ActionItems>

        <Author>
          <Avatar />
          <span>{receipt.receiverId}</span>
        </Author>

        {receipt.outgoingReceipts.map((outgoingReceipt: TxReceipt) => (
          <ExecutedReceiptRow key={outgoingReceipt.receiptId}>
            <TransactionReceipt
              receipt={outgoingReceipt}
              senderIsReceiver={receipt.receiverId === outgoingReceipt.signerId}
            />
          </ExecutedReceiptRow>
        ))}
      </ReceiptWrapper>
    );
  }
);

export default TransactionReceipt;
