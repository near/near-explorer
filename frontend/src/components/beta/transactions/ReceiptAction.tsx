import * as React from "react";
import { useTranslation } from "react-i18next";

import { styled } from "../../../libraries/styles";
import { TransactionReceipt } from "../../../types/transaction";

import { Args } from "../../transactions/ActionMessage";
import ReceiptStatus from "./ReceiptStatus";
import ReceiptArguments from "./ReceiptArguments";
import TransactionType from "./TransactionType";
import { Action } from "../../../libraries/wamp/types";

type Props = {
  receipt: TransactionReceipt;
  action: Action;
};

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

  "& textarea, pre": {
    background: "inherit",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    border: "none",
    padding: 0,
  },
});

const ArgumentsWrapper = styled("span", {
  lineHeight: "175%",
});

const Title = styled("h4", {
  fontSize: 16,
  fontWeight: 700,
  lineHeight: "175%",
  color: "#000000",
});

const ReceiptAction: React.FC<Props> = React.memo(({ action, receipt }) => {
  const { t } = useTranslation();
  return (
    <Row>
      {"args" in action.args ? (
        <>
          <Column>
            {receipt.actions.length !== 1 ? (
              <TransactionType actions={[action]} />
            ) : null}
            <Title>
              Arguments:{" "}
              <ArgumentsWrapper>
                <ReceiptArguments
                  receiverId={receipt.receiverId}
                  actionKind={action.kind}
                  actionArgs={action.args}
                />
              </ArgumentsWrapper>
            </Title>
            <CodeArgs>
              {"args" in action.args ? (
                <Args args={action.args.args} />
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
        </>
      ) : (
        <>
          {receipt.actions.length !== 1 ? (
            <Column>
              <TransactionType actions={[action]} />
            </Column>
          ) : null}
          <Column>
            <ArgumentsWrapper>
              <ReceiptArguments
                receiverId={receipt.receiverId}
                actionKind={action.kind}
                actionArgs={action.args}
              />
            </ArgumentsWrapper>
          </Column>
        </>
      )}
    </Row>
  );
});

export default ReceiptAction;
