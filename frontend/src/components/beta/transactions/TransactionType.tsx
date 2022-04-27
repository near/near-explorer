import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";
import { Action } from "../../../libraries/wamp/types";

interface Props<A extends Action> {
  actions: {
    kind: A["kind"];
  }[];
}

const Label = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 202,
  height: 46,
  borderRadius: 4,
  fontFamily: "Manrope",
  fontSize: "$font-m",
  fontWeight: 500,

  variants: {
    type: {
      CreateAccount: {
        backgroundColor: "#fde0ff",
      },
      DeleteAccount: {
        backgroundColor: "#f3d5d7",
      },
      DeployContract: {
        background: "#f9dfc8",
      },
      FunctionCall: {
        background: "#eefaff",
      },
      Transfer: {
        background: "#d0fddf",
      },
      Stake: {
        background: "#bdf4f8",
      },
      AddKey: {
        background: "#aabdee",
      },
      DeleteKey: {
        background: "#f3d5d7",
      },
      Batch: {
        background: "#e9e8e8",
      },
    },
  },
});

const TransactionType: React.FC<Props<Action>> = React.memo(({ actions }) => {
  const { t } = useTranslation();
  console.log("TransactionType | actions: ", actions);
  const actionType = actions.length !== 1 ? "Batch" : actions[0].kind;

  return (
    <Label type={actionType}>
      {actionType === "Batch"
        ? t("pages.transaction.type.Batch", {
            quantity: actions.length,
          })
        : t(`pages.transaction.type.${actionType}`)}
    </Label>
  );
});

export default TransactionType;
