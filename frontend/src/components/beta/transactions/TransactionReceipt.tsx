import * as React from "react";
import { TransactionReceipt as TxReceipt } from "../../../types/common";
import { styled } from "../../../libraries/styles";

import TransactionType from "./TransactionType";
import ReceiptInfo from "./ReceiptInfo";
import CodeArgs from "../common/CodeArgs";

type Props = {
  receipt: TxReceipt;
  refundReceiptsMap: Map<string, TxReceipt[]>;
  senderIsReceiver?: boolean;
  index?: number;
};

const ReceiptWrapper = styled("div", {
  position: "relative",
  background: "#fff",
  zIndex: 999,
});

const Author = styled("div", {
  display: "flex",
  alignItems: "center",
  fontFamily: "SF Pro Display",
  color: "#000",
  fontWeight: 600,
  fontSize: "$font-m",
  lineHeight: "150%",
});

const Avatar = styled("div", {
  size: 20,
  backgroundColor: "#c4c4c4",
  opacity: 0.2,
  borderRadius: "50%",
  marginRight: 8,
});

const ActionItems = styled("div", {
  display: "flex",
  flexDirection: "column",
  position: "relative",
  paddingLeft: 14,
  borderLeft: ".5px solid #000",
  marginLeft: "8.5px",
  marginTop: 10,
  paddingBottom: 10,
  overflowY: "hidden",

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

const ExecutedReceiptRow = styled(ActionItems, {
  [`& ${ReceiptWrapper}`]: {
    paddingBottom: 20,
    zIndex: 0,
    // position: "absolute",
    // position: "static",

    "&::after": {
      // zIndex: 1,
      display: "block",
      content: "",
      position: "absolute",
      width: 0.5,
      // height: "1000vh",
      // height: "100%",
      backgroundColor: "#000",
      // top: "calc(-1000vh + 100%)",
      top: 0,
      left: -24.5,
    },

    [`& ${ActionItems}`]: {
      marginTop: 0,
      paddingTop: 10,
    },
  },
});

const TransactionReceipt: React.FC<Props> = React.memo(
  ({ receipt, refundReceiptsMap, senderIsReceiver, index = 0 }) => {
    const [isTxTypeActive, setTxTypeActive] = React.useState(false);
    const switchActiveTxType = React.useCallback(
      () => setTxTypeActive((x) => !x),
      [setTxTypeActive]
    );

    return (
      <>
        <ReceiptWrapper
          css={{
            marginLeft: `calc(33px * ${index})`,
          }}
        >
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
        </ReceiptWrapper>
        {receipt.outgoingReceipts.length > 0 ? (
          <ExecutedReceiptRow>
            {receipt.outgoingReceipts.map(
              (outgoingReceipt: TxReceipt, index: number) => (
                <TransactionReceipt
                  key={outgoingReceipt.receiptId}
                  receipt={outgoingReceipt}
                  refundReceiptsMap={refundReceiptsMap}
                  senderIsReceiver={
                    receipt.receiverId === outgoingReceipt.signerId
                  }
                  index={receipt.outgoingReceipts.length - (index + 1)}
                />
              )
            )}
          </ExecutedReceiptRow>
        ) : null}
      </>
    );
  }
);

export default TransactionReceipt;
