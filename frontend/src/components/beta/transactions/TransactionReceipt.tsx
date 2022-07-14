import * as React from "react";
import { TransactionReceipt } from "../../../types/common";
import { styled } from "../../../libraries/styles";

import ReceiptKind from "./ReceiptKind";
import ReceiptInfo from "./ReceiptInfo";

type Props = {
  receipt: TransactionReceipt;
  convertionReceipt: boolean;
  fellowOutgoingReceipts: TransactionReceipt[];
  customCss?: React.CSSProperties;
  expandAll: boolean;
};

const Author = styled("div", {
  display: "flex",
  alignItems: "center",
  color: "#000",
  fontWeight: 600,
  fontSize: 14,
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

const TransactionReceiptView: React.FC<Props> = React.memo(
  ({
    receipt,
    convertionReceipt,
    fellowOutgoingReceipts,
    customCss,
    expandAll,
  }) => {
    const [isTxTypeActive, setTxTypeActive] = React.useState(false);
    const switchActiveTxType = React.useCallback(
      () => setTxTypeActive((x) => !x),
      [setTxTypeActive]
    );

    React.useEffect(() => switchActiveTxType, [expandAll]);

    const remainingFellowOutgoingReceipts = [...fellowOutgoingReceipts];
    const lastFellowOutgoingReceipt = remainingFellowOutgoingReceipts.pop();
    const nonRefundNestedReceipts = receipt.outcome.nestedReceipts.filter(
      (receipt) => receipt.predecessorId !== "system"
    );
    const lastNonRefundNestedReceipt = nonRefundNestedReceipts.pop();

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
              <span>{receipt.predecessorId}</span>
            </Author>
          ) : null}

          {lastFellowOutgoingReceipt ? (
            <TransactionReceiptView
              receipt={lastFellowOutgoingReceipt}
              convertionReceipt={false}
              fellowOutgoingReceipts={remainingFellowOutgoingReceipts}
              customCss={{ paddingBottom: 20, marginTop: 0 }}
              expandAll={expandAll}
            />
          ) : null}
          <ActionItems>
            {receipt.actions.map((action, index) => (
              <ReceiptKind
                key={`${action.kind}_${index}`}
                action={action}
                onClick={switchActiveTxType}
                isTxTypeActive={isTxTypeActive}
              />
            ))}
          </ActionItems>
          {isTxTypeActive ? (
            <ReceiptInfoWrapper>
              <ReceiptInfo receipt={receipt} />
            </ReceiptInfoWrapper>
          ) : null}

          <Author css={{ marginTop: 10 }}>
            <Avatar />
            <span>{receipt.receiverId}</span>
          </Author>
        </ReceiptWrapper>
        {lastNonRefundNestedReceipt ? (
          <TransactionReceiptView
            receipt={lastNonRefundNestedReceipt}
            convertionReceipt={false}
            fellowOutgoingReceipts={nonRefundNestedReceipts}
            customCss={{
              borderLeftColor: "transparent",
              paddingLeft: 0,
            }}
            expandAll={expandAll}
          />
        ) : null}
      </>
    );
  }
);

export default TransactionReceiptView;
