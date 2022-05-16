import * as React from "react";
import { TransactionReceipt as TxReceipt } from "../../../types/transaction";
import { styled } from "../../../libraries/styles";

import TransactionType from "./TransactionType";
import ReceiptInfo from "./ReceiptInfo";
import CodeArgs from "../common/CodeArgs";

type Props = {
  receipt: TxReceipt;
  refundReceiptsMap: Map<string, TxReceipt[]>;
  senderIsReceiver?: boolean;
};

const ReceiptWrapper = styled("div", {
  position: "relative",
});

const Author = styled("div", {
  display: "flex",
  fontFamily: "SF Pro Display",
  color: "#000",
  fontWeight: 600,
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
  display: "flex",
  flexDirection: "column",
  position: "relative",
  paddingLeft: 18,
  borderLeft: ".5px solid #000",
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
    borderLeft: ".5px solid #000",
    borderTop: ".5px solid #000",
    transform: "rotate(225deg)",
  },
});

const ExecutedReceiptRow = styled(ActionItems);

const TransactionReceipt: React.FC<Props> = React.memo(
  ({ receipt, refundReceiptsMap, senderIsReceiver }) => {
    const [isTxTypeActive, setTxTypeActive] = React.useState(false);
    const switchActiveTxType = React.useCallback(
      () => setTxTypeActive((x) => !x),
      [setTxTypeActive]
    );
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
            // signerId={receipt.signerId}
            // isTxTypeActive={isTxTypeActive}
            onClick={switchActiveTxType}
          />
          {isTxTypeActive && "args" in receipt.actions[0] ? (
            <CodeArgs args={receipt.actions[0].args} />
          ) : null}
          <ReceiptInfo
            isRowActive={isTxTypeActive}
            receipt={receipt}
            refundReceipts={refundReceiptsMap.get(receipt.receiptId)}
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
              refundReceiptsMap={refundReceiptsMap}
              senderIsReceiver={receipt.receiverId === outgoingReceipt.signerId}
            />
          </ExecutedReceiptRow>
        ))}
      </ReceiptWrapper>
    );
  }
);

export default TransactionReceipt;
