import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";
import { Action } from "../../../types/common";

import { NearAmount } from "../../utils/NearAmount";
import CodeArgs from "../common/CodeArgs";

export type TransactionTransferAction = {
  type: "transfer";
  amount: string;
};

// export type TransactionRefundAction = {
//   type: "refund";
//   amount: string;
// };

// export type TransactionValidatorRewardAction = {
//   type: "validator-reward";
//   amount: string;
//   blockHash: BlockHash;
// };

export type TransactionContractDeployedAction = {
  type: "contract-deployed";
};

export type TransactionAccessKeyCreatedAction = {
  type: "access-key-created";
};

export type TransactionAccessKeyRemovedAction = {
  type: "access-key-removed";
};

export type TransactionCallMethodAction = {
  type: "call-method";
  methodName: string;
};

export type TransactionRestakeAction = {
  type: "restake";
};

export type TransactionAccountCreatedAction = {
  type: "account-created";
};

export type TransactionAccountRemovedAction = {
  type: "account-removed";
};

export type TransactionActivityAction =
  | TransactionTransferAction
  // | TransactionRefundAction
  // | TransactionValidatorRewardAction
  | TransactionContractDeployedAction
  | TransactionAccessKeyCreatedAction
  | TransactionAccessKeyRemovedAction
  | TransactionCallMethodAction
  | TransactionRestakeAction
  | TransactionAccountCreatedAction
  | TransactionAccountRemovedAction;
interface Props {
  action: Action;
  onClick: React.MouseEventHandler;
  isTxTypeActive: boolean;
}

const Wrapper = styled("div", {
  alignItems: "center",
  fontFamily: "SF Mono",
  marginVertical: 10,
});

const ActionType = styled("div", {
  paddingHorizontal: 10,
  paddingVertical: 8,
  marginRight: 13,
  minWidth: 60,
  minHeight: 25,
  borderRadius: 4,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  lineHeight: "21px",
  transition: "all .15s ease-in-out",
  cursor: "pointer",

  "&:hover": {
    color: "#fff",
    backgroundColor: "#1E93FF",
  },

  variants: {
    type: {
      transfer: {
        backgroundColor: "#F0FFF5",
      },
      restake: {
        backgroundColor: "#EEFDFE",
      },
      "validator-reward": {
        backgroundColor: "#EEFDFE",
      },
      "contract-deployed": {
        backgroundColor: "#FFF2E4",
      },
      "access-key-created": {
        backgroundColor: "#ECF1FE",
      },
      "access-key-removed": {
        backgroundColor: "#FAF2F2",
      },
      "call-method": {
        backgroundColor: "#EEFAFF",
      },
      "account-created": {
        backgroundColor: "#FEF3FF",
      },
      "account-removed": {
        backgroundColor: "#FAF2F2",
      },
      batch: {
        backgroundColor: "#E9E8E8",
      },
    },
  },
});

const Description = styled("div", {
  display: "inline-flex",
  fontWeight: 400,
  fontSize: 14,
  lineHeight: "150%",

  "& span": {
    fontWeight: 600,
  },
});

const ArgsWrapper = styled("div", {
  padding: "10px 0",
  marginLeft: 100,
});

const TransactionType: React.FC<Props> = React.memo(
  ({ action, onClick, isTxTypeActive }) => {
    const { t } = useTranslation();
    const getActionType = (action: Action): TransactionActivityAction => {
      switch (action.kind) {
        case "AddKey":
          return {
            type: "access-key-created",
          };
        case "CreateAccount":
          return {
            type: "account-created",
          };
        case "DeleteAccount":
          return {
            type: "account-removed",
          };
        case "DeleteKey":
          return {
            type: "access-key-removed",
          };
        case "DeployContract":
          return {
            type: "contract-deployed",
          };
        case "FunctionCall":
          return {
            type: "call-method",
            methodName: action.args.method_name,
          };
        case "Stake":
          return {
            type: "restake",
          };
        case "Transfer":
          return {
            type: "transfer",
            amount: action.args.deposit,
          };
      }
    };

    const actionType = getActionType(action);

    return (
      <Wrapper>
        <ActionType type={actionType.type} onClick={onClick}>
          {t(`pages.transaction.type.${actionType.type}`)}
          {actionType.type === "call-method" ? (
            <Description>&lsquo;{actionType.methodName}&lsquo;</Description>
          ) : null}
        </ActionType>
        {actionType.type === "transfer" ? (
          <Description>
            <span>
              <NearAmount amount={actionType.amount} decimalPlaces={2} />
            </span>
          </Description>
        ) : null}

        {"args" in action && "args" in action.args && isTxTypeActive ? (
          <ArgsWrapper>
            <CodeArgs args={action.args.args} />
          </ArgsWrapper>
        ) : null}
      </Wrapper>
    );
  }
);

export default TransactionType;
