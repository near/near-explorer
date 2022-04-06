import * as React from "react";
import { useTranslation } from "react-i18next";

import { styled } from "../../../libraries/styles";

import { Args } from "../../transactions/ActionMessage";
import ReceiptStatus from "./ReceiptStatus";

type Props = {
  receipt: any;
};

const DetailsWrapper = styled("div", {
  display: "flex",
  justifyContent: "space-between",
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
  fontSize: 16,
  fontWeight: 700,
  lineHeight: "175%",
  color: "#000000",
});

const ReceiptDetails: React.FC<Props> = React.memo(({ receipt }) => {
  const { t } = useTranslation();
  return (
    <DetailsWrapper>
      <Column>
        <Title>Arguments</Title>
        <CodeArgs>
          {"args" in receipt.actions[0].args ? (
            <Args args={receipt.actions[0].args.args} />
          ) : (
            "The arguments are empty"
          )}
        </CodeArgs>
      </Column>
      <Column>
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
      </Column>
    </DetailsWrapper>
  );
});

export default ReceiptDetails;
