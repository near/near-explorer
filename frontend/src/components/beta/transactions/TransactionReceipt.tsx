import * as React from "react";
import { TransactionReceipt as TxReceipt } from "../../../types/common";
import { styled } from "../../../libraries/styles";

import TransactionType from "./TransactionType";
import ReceiptInfo from "./ReceiptInfo";

type Props = {
  receipt: TxReceipt;
  refundReceiptsMap: Map<string, TxReceipt[]>;
  convertionReceipt: boolean;
  fellowOutgoingReceipts?: TxReceipt[];
  customCss?: React.CSSProperties;
};

const Author = styled("div", {
  display: "flex",
  alignItems: "center",
  fontFamily: "SF Pro Display",
  color: "#000",
  fontWeight: 600,
  fontSize: "$font-m",
  lineHeight: "150%",
  position: "relative",
});

const ActionItems = styled("div", {
  display: "flex",
  flexDirection: "column",
  position: "relative",
  borderLeft: ".5px solid #000",
  marginLeft: 8.5,
  paddingVertical: 4,
  paddingLeft: 14,
});

const ReceiptWrapper = styled("div", {
  marginTop: 10,
  marginLeft: 8.5,
  paddingLeft: 33,
  borderLeft: ".5px solid #000",

  [`& ${Author}`]: {
    "&:last-child": {
      "&::before": {
        display: "block",
        content: "",
        position: "absolute",
        width: 5,
        height: 5,
        bottom: 31,
        left: 6.235,
        background: "url(/static/images/icon-arrow-down-black.svg) no-repeat",
      },
    },
  },
});

const Avatar = styled("div", {
  size: 20,
  backgroundColor: "#c4c4c4",
  opacity: 0.2,
  borderRadius: "50%",
  marginRight: 8,
});

const ReceiptInfoWrapper = styled("div", {
  borderLeft: ".5px solid #000",
  marginLeft: 8.5,
});

const TransactionReceipt: React.FC<Props> = React.memo(
  ({
    receipt,
    refundReceiptsMap,
    convertionReceipt,
    fellowOutgoingReceipts,
    customCss,
  }) => {
    const [isTxTypeActive, setTxTypeActive] = React.useState(false);
    const switchActiveTxType = React.useCallback(
      () => setTxTypeActive((x) => !x),
      [setTxTypeActive]
    );

    const remainingFellowOutgoingReceipts = [...(fellowOutgoingReceipts || [])];
    const lastFellowOutgoingReceipt = remainingFellowOutgoingReceipts.pop();
    const outgoingReceipts = [...receipt.outgoingReceipts];
    const lastOutgoingReceipt = outgoingReceipts.pop();

    return (
      <>
        <ReceiptWrapper
          style={
            convertionReceipt
              ? {
                  paddingLeft: 0,
                  borderLeftColor: "transparent",
                  marginTop: 0,
                }
              : {}
          }
          css={{ ...customCss }}
        >
          {convertionReceipt ? (
            <Author css={{ marginBottom: 10 }}>
              <Avatar />
              <span>{receipt.signerId}</span>
            </Author>
          ) : null}

          {lastFellowOutgoingReceipt ? (
            <TransactionReceipt
              receipt={lastFellowOutgoingReceipt}
              refundReceiptsMap={refundReceiptsMap}
              convertionReceipt={false}
              fellowOutgoingReceipts={remainingFellowOutgoingReceipts}
              customCss={{ paddingBottom: 20, marginTop: 0 }}
            />
          ) : null}
          <ActionItems>
            {receipt.actions.map((action, index) => (
              <TransactionType
                key={`${action.kind}_${index}`}
                action={action}
                onClick={switchActiveTxType}
                isTxTypeActive={isTxTypeActive}
              />
            ))}
          </ActionItems>
          {isTxTypeActive ? (
            <ReceiptInfoWrapper>
              <ReceiptInfo
                receipt={receipt}
                refundReceipts={refundReceiptsMap.get(receipt.receiptId)}
              />
            </ReceiptInfoWrapper>
          ) : null}

          <Author css={{ marginTop: 10 }}>
            <Avatar />
            <span>{receipt.receiverId}</span>
          </Author>
        </ReceiptWrapper>
        {lastOutgoingReceipt ? (
          <TransactionReceipt
            receipt={lastOutgoingReceipt}
            refundReceiptsMap={refundReceiptsMap}
            convertionReceipt={false}
            fellowOutgoingReceipts={outgoingReceipts}
            customCss={{
              borderLeftColor: "transparent",
              paddingLeft: 0,
            }}
          />
        ) : null}
      </>
    );
  }
);

export default TransactionReceipt;
