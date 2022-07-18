import * as React from "react";
import { TransactionReceipt } from "../../../types/common";
import { styled } from "../../../libraries/styles";

import ReceiptKind from "./ReceiptKind";
import ReceiptInfo from "./ReceiptInfo";

type Props = {
  receipt: TransactionReceipt;
  convertionReceipt: boolean;
  fellowOutgoingReceipts: TransactionReceipt[];
  className: string;
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

const Predecessor = styled(Author, {
  marginBottom: 10,
});

const Receiver = styled(Author, {
  marginTop: 10,
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

  "&.lastFellowReceipt": {
    paddingBottom: 20,
    marginTop: 0,
  },

  "&.lastNonRefundReceipt": {
    borderLeftColor: "transparent",
    paddingLeft: 0,
  },

  variants: {
    convertionReceipt: {
      true: {
        paddingLeft: 0,
        borderLeftColor: "transparent",
        marginTop: 0,
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
    className,
    expandAll,
  }) => {
    const [isTxTypeActive, setTxTypeActive] = React.useState(false);
    const switchActiveTxType = React.useCallback(
      () => setTxTypeActive((x) => !x),
      [setTxTypeActive]
    );

    React.useEffect(() => switchActiveTxType, [expandAll]);

    const remainingFellowOutgoingReceipts = fellowOutgoingReceipts.slice(0, -1);
    const lastFellowOutgoingReceipt = fellowOutgoingReceipts.at(-1);
    const filterRefundNestedReceipts = receipt.outcome.nestedReceipts.filter(
      (receipt) => receipt.predecessorId !== "system"
    );
    const nonRefundNestedReceipts = filterRefundNestedReceipts.slice(0, -1);
    const lastNonRefundNestedReceipt = filterRefundNestedReceipts.at(-1);

    return (
      <>
        <ReceiptWrapper
          convertionReceipt={convertionReceipt}
          className={className}
        >
          {convertionReceipt ? (
            <Predecessor>
              <Avatar />
              <span>{receipt.predecessorId}</span>
            </Predecessor>
          ) : null}

          {lastFellowOutgoingReceipt ? (
            <TransactionReceiptView
              receipt={lastFellowOutgoingReceipt}
              convertionReceipt={false}
              fellowOutgoingReceipts={remainingFellowOutgoingReceipts}
              className="lastFellowReceipt"
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

          <Receiver>
            <Avatar />
            <span>{receipt.receiverId}</span>
          </Receiver>
        </ReceiptWrapper>
        {lastNonRefundNestedReceipt ? (
          <TransactionReceiptView
            receipt={lastNonRefundNestedReceipt}
            convertionReceipt={false}
            fellowOutgoingReceipts={nonRefundNestedReceipts}
            className="lastNonRefundReceipt"
            expandAll={expandAll}
          />
        ) : null}
      </>
    );
  }
);

export default TransactionReceiptView;
