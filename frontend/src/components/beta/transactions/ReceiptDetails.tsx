import * as React from "react";
import { useTranslation } from "react-i18next";

import { styled } from "../../../libraries/styles";
import { TransactionReceipt } from "../../../types/common";

import ReceiptStatus from "./ReceiptStatus";

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

const CodeArgs = styled("div", {
  // background: "#ABAFB4",
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
  return (
    <DetailsWrapper>
      <Row>
        <Column>
          <div>
            <Title>Logs</Title>
            <CodeArgs>
              {receipt.logs.length === 0 ? (
                t("component.transactions.ReceiptRow.no_logs")
              ) : (
                <pre>{receipt.logs.join("\n")}</pre>
              )}
            </CodeArgs>
          </div>
          <div>
            <Title>Result</Title>
            <CodeArgs>
              {"SuccessValue" in receipt.status &&
              receipt.status["SuccessValue"].length === 0 ? (
                t("component.transactions.ReceiptRow.empty_result")
              ) : (
                <ReceiptStatus status={receipt.status} />
              )}
            </CodeArgs>
          </div>
        </Column>
      </Row>
    </DetailsWrapper>
  );
});

export default ReceiptDetails;
