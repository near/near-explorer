import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";
import Moment from "../../../libraries/moment";

import { TransactionDetails } from "../../../types/common";

import TransactionReceipt from "./TransactionReceipt";

type Props = {
  transaction: TransactionDetails;
};

const Contaier = styled("div", {
  minHeight: "calc(100vh - 360px)",
  background: "#fff",
});

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 1196,
  margin: "32px auto",
  padding: 40,
  fontFamily: "Manrope",
  border: "1px solid #ebebeb",
  borderRadius: 10,
});

const TitleWrapper = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  fontFamily: "SF Pro Display",
  width: "100%",
  marginBottom: 30,

  "& span": {
    color: "#a3a3a3",
    fontSize: 10,
    fontWeight: 400,
    lineHeight: 1,
  },
});

const Title = styled("h4", {
  fontSize: 16,
  fontWeight: "700",
  lineHeight: 1,
  marginBottom: 0,
});

const Expand = styled("div", {
  fontFamily: "SF Pro Display",
  fontSize: 14,
  fontWeight: 400,
  color: "#000",
  cursor: "pointer",
  userSelect: "none",

  "& span": {
    marginLeft: 10,
    color: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
  },
});

const TransactionActionsList: React.FC<Props> = React.memo(
  ({ transaction: { created, receipt, refundReceipts } }) => {
    const [expandAll, setExpandAll] = React.useState(false);
    const expandAllReceipts = React.useCallback(
      () => setExpandAll((x) => !x),
      [setExpandAll]
    );
    const { t } = useTranslation();

    const refundReceiptsMap = new Map();
    refundReceipts.forEach((receipt) => {
      // handle multiple refunds per receipt
      if (refundReceiptsMap.has(receipt.parentReceiptHash)) {
        refundReceiptsMap.set(receipt.parentReceiptHash, [
          ...refundReceiptsMap.get(receipt.parentReceiptHash),
          receipt,
        ]);
      } else {
        refundReceiptsMap.set(receipt.parentReceiptHash, [receipt]);
      }
    });

    const start = Moment(created.timestamp);
    const end = Moment(
      receipt.outgoingReceipts[receipt.outgoingReceipts.length - 1]
        ?.includedInBlock.timestamp
    );
    const pending = end.from(start, true);

    return (
      <Contaier>
        <Wrapper>
          <TitleWrapper>
            <div>
              <Title>Execution Plan</Title>
              <span>
                {t("pages.transaction.header.processed")}
                {pending}
              </span>
            </div>
            <Expand onClick={expandAllReceipts}>
              Expand All
              <span>+</span>
            </Expand>
          </TitleWrapper>
          <TransactionReceipt
            receipt={receipt}
            refundReceiptsMap={refundReceiptsMap}
            convertionReceipt={true}
            expandAll={expandAll}
          />
        </Wrapper>
      </Contaier>
    );
  }
);

export default TransactionActionsList;
