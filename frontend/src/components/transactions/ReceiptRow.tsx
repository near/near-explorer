import BN from "bn.js";

import { FC } from "react";

import { Row, Col } from "react-bootstrap";

import Gas from "../utils/Gas";
import Balance from "../utils/Balance";
import AccountLink from "../utils/AccountLink";
import BlockLink from "../utils/BlockLink";
import ReceiptLink from "../utils/ReceiptLink";
import { displayArgs } from "./ActionMessage";
import ActionRow from "./ActionRow";

import { useTranslation } from "react-i18next";
import { NestedReceiptWithOutcome } from "../../pages/transactions/[hash]";
import {
  RpcReceiptFailure,
  RpcReceiptSuccessId,
  RpcReceiptSuccessValue,
} from "../../libraries/wamp/types";
import { styled } from "../../libraries/styles";

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

export interface Props {
  receipt: NestedReceiptWithOutcome;
  transactionHash: string;
}

const ReceiptRow: FC<Props> = ({ receipt, transactionHash }) => {
  const { t } = useTranslation();
  let statusInfo;
  if ("SuccessValue" in (receipt.outcome.status as RpcReceiptSuccessValue)) {
    const { SuccessValue } = receipt.outcome.status as RpcReceiptSuccessValue;
    if (SuccessValue === null) {
      statusInfo = t("component.transactions.ReceiptRow.no_result");
    } else if (SuccessValue.length === 0) {
      statusInfo = t("component.transactions.ReceiptRow.empty_result");
    } else {
      statusInfo = (
        <>
          <i>{t("component.transactions.ReceiptRow.result")}: </i>
          {displayArgs(SuccessValue, t)}
        </>
      );
    }
  } else if ("Failure" in (receipt.outcome.status as RpcReceiptFailure)) {
    const { Failure } = receipt.outcome.status as RpcReceiptFailure;
    statusInfo = (
      <>
        <i>{t("component.transactions.ReceiptRow.failure")}: </i>
        <pre>{JSON.stringify(Failure, null, 2)}</pre>
      </>
    );
  } else if (
    "SuccessReceiptId" in (receipt.outcome.status as RpcReceiptSuccessId)
  ) {
    const { SuccessReceiptId } = receipt.outcome.status as RpcReceiptSuccessId;
    statusInfo = (
      <>
        <i>{t("component.transactions.ReceiptRow.success_receipt_id")}: </i>
        <pre>{SuccessReceiptId}</pre>
      </>
    );
  }

  let gasBurnedByReceipt = new BN(0);
  let tokensBurnedByReceipt = new BN(0);
  if (receipt && receipt.outcome) {
    gasBurnedByReceipt = new BN(receipt.outcome.gas_burnt);
    tokensBurnedByReceipt = new BN(receipt.outcome.tokens_burnt);
  }
  return (
    <ReceiptRowWrapper
      noGutters
      key={receipt.receipt_id}
      id={receipt.receipt_id}
    >
      <Col>
        <Row noGutters>
          <ReceiptRowHashTitle>
            <b>{t("common.receipts.receipt")}:</b>
          </ReceiptRowHashTitle>
        </Row>

        <ReceiptRowSection noGutters>
          <ReceiptRowTitle>{t("common.receipts.receipt_id")}:</ReceiptRowTitle>
          <ReceiptRowReceiptHash truncateLink>
            <ReceiptLink
              transactionHash={transactionHash}
              receiptId={receipt.receipt_id}
              truncate={false}
            />
          </ReceiptRowReceiptHash>
        </ReceiptRowSection>

        <ReceiptRowSection noGutters>
          <ReceiptRowTitle>
            {t("common.receipts.executed_in_block")}:
          </ReceiptRowTitle>
          <ReceiptRowReceiptHash truncateLink>
            <BlockLink blockHash={receipt.block_hash} truncate={false} />
          </ReceiptRowReceiptHash>
        </ReceiptRowSection>

        <ReceiptRowSection noGutters>
          <ReceiptRowTitle>
            {t("common.receipts.predecessor_id")}:
          </ReceiptRowTitle>
          <ReceiptRowReceiptHash title={receipt.predecessor_id}>
            <AccountLink accountId={receipt.predecessor_id} />
          </ReceiptRowReceiptHash>
        </ReceiptRowSection>

        <ReceiptRowSection noGutters>
          <ReceiptRowTitle>{t("common.receipts.receiver_id")}:</ReceiptRowTitle>
          <ReceiptRowReceiptHash title={receipt.receiver_id}>
            <AccountLink accountId={receipt.receiver_id} />
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
                    key={receipt.receipt_id + index}
                    action={action}
                    receiverId={receipt.receiver_id}
                    signerId={receipt.predecessor_id}
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

        {receipt.outcome.outgoing_receipts &&
          receipt.outcome.outgoing_receipts.length > 0 &&
          receipt.outcome.outgoing_receipts.map((executedReceipt) => (
            <ExecutedReceiptRow noGutters key={executedReceipt.receipt_id}>
              <Col>
                <ReceiptRow
                  transactionHash={transactionHash}
                  receipt={executedReceipt}
                />
              </Col>
            </ExecutedReceiptRow>
          ))}
      </Col>
    </ReceiptRowWrapper>
  );
};

export default ReceiptRow;
