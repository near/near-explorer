import * as React from "react";
import { useTranslation } from "react-i18next";
import CodeArgs from "../common/CodeArgs";
import JsonView from "../common/JsonView";

import { styled } from "../../../libraries/styles";
import { TransactionReceipt } from "../../../types/common";

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
  fontSize: "$font-m",
  fontWeight: 500,
  fontFamily: "SF Mono",

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
  fontSize: "$font-m",
  fontWeight: 500,
  fontFamily: "SF Pro Display",
  lineHeight: "175%",
  color: "#000000",
});

const ReceiptDetails: React.FC<Props> = React.memo(({ receipt }) => {
  const { t } = useTranslation();
  let statusInfo;
  if ("SuccessValue" in receipt.status) {
    const { SuccessValue } = receipt.status;
    if (SuccessValue.length === 0) {
      statusInfo = (
        <CodeArgsWrapper>
          {t("component.transactions.ReceiptRow.empty_result")}
        </CodeArgsWrapper>
      );
    } else {
      statusInfo = <CodeArgs args={SuccessValue} />;
    }
  } else if ("Failure" in receipt.status) {
    const { Failure } = receipt.status;
    statusInfo = <JsonView args={Failure as object} />;
  } else if ("SuccessReceiptId" in receipt.status) {
    const { SuccessReceiptId } = receipt.status;
    statusInfo = (
      <CodeArgsWrapper>
        <pre>{SuccessReceiptId}</pre>
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
              {receipt.logs.length === 0 ? (
                t("component.transactions.ReceiptRow.no_logs")
              ) : (
                <pre>{receipt.logs.join("\n")}</pre>
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
