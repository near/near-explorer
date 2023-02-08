import * as React from "react";
import { useTranslation } from "react-i18next";
import CodeArgs from "@explorer/frontend/components/beta/common/CodeArgs";
import JsonView from "@explorer/frontend/components/beta/common/JsonView";

import { styled } from "@explorer/frontend/libraries/styles";
import { TransactionReceipt } from "@explorer/common/types/procedures";

type Props = {
  receipt: TransactionReceipt;
};

const DetailsWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  marginVertical: 24,
});

const Row = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  marginVertical: 20,

  "&:last-child": {
    marginVertical: 0,
  },
});

const Column = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "48%",
});

const CodeArgsWrapper = styled("div", {
  background: "#f8f8f8",
  borderRadius: 4,
  color: "#3f4246",
  padding: 20,
  fontSize: 14,
  fontWeight: 500,

  "& textarea, pre": {
    background: "inherit",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    border: "none",
    padding: 0,
  },
});

const Title = styled("h4", {
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "175%",
  color: "#000000",
});

const ReceiptDetails: React.FC<Props> = React.memo(({ receipt }) => {
  const { t } = useTranslation();
  let statusInfo;

  if (receipt.outcome.status.type === "successValue") {
    if (receipt.outcome.status.value.length === 0) {
      statusInfo = (
        <CodeArgsWrapper>
          {t("component.transactions.ReceiptRow.empty_result")}
        </CodeArgsWrapper>
      );
    } else {
      statusInfo = <CodeArgs args={receipt.outcome.status.value} />;
    }
  } else if (receipt.outcome.status.type === "failure") {
    statusInfo = <JsonView args={receipt.outcome.status.error} />;
  } else if (receipt.outcome.status.type === "successReceiptId") {
    statusInfo = (
      <CodeArgsWrapper>
        <pre>{receipt.outcome.status.receiptId}</pre>
      </CodeArgsWrapper>
    );
  }
  return (
    <DetailsWrapper>
      <Row>
        <Column>
          <div>
            <Title>Logs</Title>
            <CodeArgsWrapper>
              {receipt.outcome.logs.length === 0 ? (
                t("component.transactions.ReceiptRow.no_logs")
              ) : (
                <pre>{receipt.outcome.logs.join("\n")}</pre>
              )}
            </CodeArgsWrapper>
          </div>
          <div>
            <Title>Result</Title>
            {statusInfo}
          </div>
        </Column>
      </Row>
    </DetailsWrapper>
  );
});

export default ReceiptDetails;
