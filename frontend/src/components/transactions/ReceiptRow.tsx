import * as React from "react";

import JSBI from "jsbi";
import { useTranslation } from "next-i18next";
import { Row, Col } from "react-bootstrap";

import { NestedReceiptWithOutcomeOld } from "@/common/types/procedures";
import { Args } from "@/frontend/components/transactions/ActionMessage";
import { ActionRow } from "@/frontend/components/transactions/ActionRow";
import { AccountLink } from "@/frontend/components/utils/AccountLink";
import { Balance } from "@/frontend/components/utils/Balance";
import { BlockLink } from "@/frontend/components/utils/BlockLink";
import { Gas } from "@/frontend/components/utils/Gas";
import { ReceiptLink } from "@/frontend/components/utils/ReceiptLink";
import * as BI from "@/frontend/libraries/bigint";
import { styled } from "@/frontend/libraries/styles";

const ReceiptRowWrapper = styled(Row, {
  paddingTop: 10,
  paddingBottom: 30,
});

const ExecutedReceiptRow = styled(Row, {
  [`& ${ReceiptRowWrapper}`]: {
    paddingLeft: "1.5rem",
    paddingBottom: 0,
    borderLeft: "2px solid #e5e5e5",
  },
});

const ReceiptRowSection = styled(Row, {
  paddingTop: 10,
  paddingLeft: "1.5rem",
  borderLeft: "2px solid #e5e5e5",
});

const ReceiptRowTitle = styled(Col, {
  fontSize: 14,
  lineHeight: 1.29,
  color: "#24272a",
});

const ReceiptRowHashTitle = styled(ReceiptRowTitle, {
  paddingBottom: 10,
});

const ReceiptRowText = styled(Col, {
  fontSize: 12,
  lineHeight: 1.5,
  color: "#999999",
});

const ReceiptRowReceiptHash = styled(Col, {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.29,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",

  variants: {
    truncateLink: {
      true: {
        color: "#007bff",
      },
    },
  },
});

const ReceiptRowStatus = styled(Col, {
  fontSize: 12,
  color: "#999999",
  fontWeight: 500,
});

const NotFoundReceipt = styled(Col, {
  paddingTop: 8,
  marginVertical: 8,
  borderColor: "#999999",
  borderWidth: 0,
  borderTopWidth: 1,
  borderStyle: "solid",
});

export interface Props {
  receipt: NestedReceiptWithOutcomeOld;
  transactionHash: string;
}

export const ReceiptRow: React.FC<Props> = React.memo(
  ({ receipt, transactionHash }) => {
    const { t } = useTranslation();
    let statusInfo;
    if (receipt.outcome.status.type === "successValue") {
      if (!receipt.outcome.status.value) {
        statusInfo = t("component.transactions.ReceiptRow.empty_result");
      } else {
        statusInfo = (
          <>
            <i>{t("component.transactions.ReceiptRow.result")}: </i>
            <Args args={receipt.outcome.status.value} />
          </>
        );
      }
    } else if (receipt.outcome.status.type === "failure") {
      statusInfo = (
        <>
          <i>{t("component.transactions.ReceiptRow.failure")}: </i>
          <pre>{JSON.stringify(receipt.outcome.status.error, null, 2)}</pre>
        </>
      );
    } else if (receipt.outcome.status.type === "successReceiptId") {
      statusInfo = (
        <>
          <i>{t("component.transactions.ReceiptRow.success_receipt_id")}: </i>
          <pre>{receipt.outcome.status.receiptId}</pre>
        </>
      );
    }

    let gasBurnedByReceipt = BI.zero;
    let tokensBurnedByReceipt = BI.zero;
    if (receipt && receipt.outcome) {
      gasBurnedByReceipt = JSBI.BigInt(receipt.outcome.gasBurnt);
      tokensBurnedByReceipt = JSBI.BigInt(receipt.outcome.tokensBurnt);
    }
    return (
      <ReceiptRowWrapper noGutters key={receipt.id} id={receipt.id}>
        <Col>
          <Row noGutters>
            <ReceiptRowHashTitle>
              <b>{t("common.receipts.receipt")}:</b>
            </ReceiptRowHashTitle>
          </Row>

          <ReceiptRowSection noGutters>
            <ReceiptRowTitle>
              {t("common.receipts.receipt_id")}:
            </ReceiptRowTitle>
            <ReceiptRowReceiptHash truncateLink>
              <ReceiptLink
                transactionHash={transactionHash}
                receiptId={receipt.id}
                truncate={false}
              />
            </ReceiptRowReceiptHash>
          </ReceiptRowSection>

          <ReceiptRowSection noGutters>
            <ReceiptRowTitle>
              {t("common.receipts.executed_in_block")}:
            </ReceiptRowTitle>
            <ReceiptRowReceiptHash truncateLink>
              <BlockLink
                blockHash={receipt.outcome.blockHash}
                truncate={false}
              />
            </ReceiptRowReceiptHash>
          </ReceiptRowSection>

          <ReceiptRowSection noGutters>
            <ReceiptRowTitle>
              {t("common.receipts.predecessor_id")}:
            </ReceiptRowTitle>
            <ReceiptRowReceiptHash title={receipt.predecessorId}>
              <AccountLink accountId={receipt.predecessorId} />
            </ReceiptRowReceiptHash>
          </ReceiptRowSection>

          <ReceiptRowSection noGutters>
            <ReceiptRowTitle>
              {t("common.receipts.receiver_id")}:
            </ReceiptRowTitle>
            <ReceiptRowReceiptHash title={receipt.receiverId}>
              <AccountLink accountId={receipt.receiverId} />
            </ReceiptRowReceiptHash>
          </ReceiptRowSection>

          <ReceiptRowSection noGutters>
            <ReceiptRowTitle>
              {t("common.transactions.execution.gas_burned")}:
            </ReceiptRowTitle>
            <ReceiptRowReceiptHash>
              {gasBurnedByReceipt ? <Gas gas={gasBurnedByReceipt} /> : "..."}
            </ReceiptRowReceiptHash>
          </ReceiptRowSection>

          <ReceiptRowSection noGutters>
            <ReceiptRowTitle>
              {t("common.transactions.execution.tokens_burned")}:
            </ReceiptRowTitle>
            <ReceiptRowReceiptHash>
              {tokensBurnedByReceipt ? (
                <Balance amount={tokensBurnedByReceipt.toString()} />
              ) : (
                "..."
              )}
            </ReceiptRowReceiptHash>
          </ReceiptRowSection>

          <ReceiptRowSection noGutters>
            <ReceiptRowText>
              {receipt.actions && receipt.actions.length > 0
                ? receipt.actions.map((action, index) => (
                    <ActionRow
                      // eslint-disable-next-line react/no-array-index-key
                      key={receipt.id + index}
                      action={action}
                      receiverId={receipt.receiverId}
                      signerId={receipt.predecessorId}
                      detalizationMode="minimal"
                      showDetails
                    />
                  ))
                : t("component.transactions.ReceiptRow.no_actions")}
            </ReceiptRowText>
          </ReceiptRowSection>

          <ReceiptRowSection noGutters>
            <ReceiptRowStatus>{statusInfo}</ReceiptRowStatus>
          </ReceiptRowSection>

          <ReceiptRowSection noGutters>
            <ReceiptRowText>
              {receipt.outcome.logs.length === 0 ? (
                t("component.transactions.ReceiptRow.no_logs")
              ) : (
                <pre>{receipt.outcome.logs.join("\n")}</pre>
              )}
            </ReceiptRowText>
          </ReceiptRowSection>

          {receipt.outcome.nestedReceipts.length > 0 &&
            receipt.outcome.nestedReceipts.map((executedReceipt) =>
              "outcome" in executedReceipt ? (
                <ExecutedReceiptRow noGutters key={executedReceipt.id}>
                  <Col>
                    <ReceiptRow
                      transactionHash={transactionHash}
                      receipt={executedReceipt}
                    />
                  </Col>
                </ExecutedReceiptRow>
              ) : (
                <ExecutedReceiptRow noGutters key={executedReceipt.id}>
                  <NotFoundReceipt>
                    Receipt {executedReceipt.id} not found
                  </NotFoundReceipt>
                </ExecutedReceiptRow>
              )
            )}
        </Col>
      </ReceiptRowWrapper>
    );
  }
);
