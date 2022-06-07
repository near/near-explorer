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

  "&::before": {
    content: "",
    display: "block",
    position: "absolute",
    top: 24,
    left: 9,
    width: 0.5,
    height: "calc(100% - 48px)",
    backgroundColor: "#000",
  },
  "&::after": {
    zIndex: 1,
    display: "block",
    content: "",
    position: "absolute",
    width: 5,
    height: 5,
    bottom: 24,
    left: 6.5,
    borderLeft: ".5px solid #000",
    borderTop: ".5px solid #000",
    transform: "rotate(225deg)",
  },
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
  // borderLeft: ".5px solid #000",
  marginLeft: "8.5px",
  paddingTop: 10,
  paddingBottom: 10,

  // "&::after": {
  //   zIndex: 1,
  //   display: "block",
  //   content: "",
  //   position: "absolute",
  //   width: 5,
  //   height: 5,
  //   bottom: 0,
  //   left: "-3px",
  //   borderLeft: ".5px solid #000",
  //   borderTop: ".5px solid #000",
  //   transform: "rotate(225deg)",
  // },
});

const ExecutedReceiptRow = styled(ActionItems, {
  [`& ${ReceiptWrapper}`]: {
    paddingBottom: 20,

    [`& ${ActionItems}`]: {
      marginTop: 0,
      paddingTop: 10,
    },
  },
});

const OutgoingReceiptWrapper = styled(ReceiptWrapper, {
  "&::before": {
    top: 0,
  },
  "&::after": {
    display: "none",
  },
  [`& > ${ActionItems}`]: {
    "&::after": {
      display: "none",
    },
  },
  [`& ${ReceiptWrapper}`]: {
    "&::before": {
      top: 0,
      height: "calc(100% - 48px)",
    },
    "&::after": {
      bottom: 48,
    },
  },
});

const TransactionReceipt: React.FC<Props> = React.memo(
  ({ receipt, refundReceiptsMap, senderIsReceiver, index = null }) => {
    const [isTxTypeActive, setTxTypeActive] = React.useState(false);
    const switchActiveTxType = React.useCallback(
      () => setTxTypeActive((x) => !x),
      [setTxTypeActive]
    );

    return (
      <>
        <ReceiptWrapper
          css={{
            marginLeft: index !== null ? `calc(33px * ${index} - 22.5px)` : 0,
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
          <OutgoingReceiptWrapper>
            {receipt.outgoingReceipts.map(
              (outgoingReceipt: TxReceipt, index: number) => (
                <ExecutedReceiptRow key={outgoingReceipt.receiptId}>
                  <TransactionReceipt
                    receipt={outgoingReceipt}
                    refundReceiptsMap={refundReceiptsMap}
                    senderIsReceiver={
                      receipt.receiverId === outgoingReceipt.signerId
                    }
                    index={receipt.outgoingReceipts.length - (index + 1)}
                  />
                </ExecutedReceiptRow>
              )
            )}
          </OutgoingReceiptWrapper>
        ) : null}
      </>
    );
  }
);

export default TransactionReceipt;
