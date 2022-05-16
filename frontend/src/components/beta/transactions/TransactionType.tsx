import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";
import { YoctoNEAR } from "../../../types/nominal";
import { Action } from "../../../types/procedures";
import { TransactionActivityAction } from "../../../types/transaction";

import { formatNear } from "../../../libraries/formatting";
interface Props {
  actions: Action[];
  onClick: any;
}

const Wrapper = styled("div", {
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "SF Mono",
  cursor: "pointer",
});

const ActionType = styled("div", {
  paddingHorizontal: 6,
  paddingVertical: 8,
  minWidth: 60,
  minHeight: 25,
  borderRadius: 4,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "$font-s",
  lineHeight: "18px",
  transition: "all .15s ease-in-out",

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

        "&:hover": {
          color: "#fff",
          backgroundColor: "#1E93FF",
        },
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
  fontSize: "$font-s",
  lineHeight: "150%",
  marginLeft: "4.5px",

  "& span": {
    fontWeight: 600,
  },
});

const TransactionType: React.FC<Props> = React.memo(({ actions, onClick }) => {
  const { t } = useTranslation();
  const getActionMapping = (actions: Action[]): TransactionActivityAction => {
    if (actions.length === 0) {
      throw new Error("Unexpected zero-length array of actions");
    }
    if (actions.length !== 1) {
      return {
        type: "batch",
        actions: actions.map((action) => getActionMapping([action])),
      };
    }
    switch (actions[0].kind) {
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
          methodName: actions[0].args.method_name,
        };
      case "Stake":
        return {
          type: "restake",
        };
      case "Transfer":
        return {
          type: "transfer",
          amount: actions[0].args.deposit as YoctoNEAR,
        };
    }
  };

  const actionMapping = getActionMapping(actions);

  return (
    <Wrapper onClick={onClick}>
      <ActionType type={actionMapping.type}>
        {t(`pages.transaction.type.${actionMapping.type}`, {
          quantity:
            actionMapping.type === "batch"
              ? actionMapping.actions.length
              : undefined,
        })}
        {actionMapping.type === "call-method" ? (
          <Description>&lsquo;{actionMapping.methodName}&lsquo;</Description>
        ) : null}
      </ActionType>
      {actionMapping.type === "transfer" ? (
        <Description>
          <span>{formatNear(actionMapping.amount)}</span>
        </Description>
      ) : null}
    </Wrapper>
  );
});

export default TransactionType;
