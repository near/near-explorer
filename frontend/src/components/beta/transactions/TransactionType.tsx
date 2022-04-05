import * as React from "react";
import { styled } from "../../../libraries/styles";
import { Action, ActionMapping } from "../../../libraries/wamp/types";

interface Props<A extends Action> {
  actionKind: A["kind"];
  // actionArgs: A["args"];
  // receiverId: string;
  // showDetails?: boolean;
}

type TransactionMessageRenderers = {
  [K in Action["kind"]]: React.FC<Props<ActionMapping[K]>>;
};

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
      createAccount: {
        backgroundColor: "#fde0ff",
      },
      deleteAccount: {
        backgroundColor: "#f3d5d7",
      },
      deployContract: {
        background: "#f9dfc8",
      },
      functionCall: {
        background: "#eefaff",
      },
      transfer: {
        background: "#d0fddf",
      },
      stake: {
        background: "#bdf4f8",
      },
      addKey: {
        background: "#aabdee",
      },
      deleteKey: {
        background: "#f3d5d7",
      },
    },
  },
});

const CreateAccount: TransactionMessageRenderers["CreateAccount"] = React.memo(
  () => {
    // const { t } = useTranslation();
    return <Label type="createAccount">Account Created</Label>;
  }
);

const DeleteAccount: TransactionMessageRenderers["DeleteAccount"] = React.memo(
  () => {
    // const { t } = useTranslation();
    return <Label type="deleteAccount">Account Deleted</Label>;
  }
);

const DeployContract: TransactionMessageRenderers["DeployContract"] = React.memo(
  () => {
    // const { t } = useTranslation();
    return <Label type="deployContract">Contract Deployed</Label>;
  }
);

const FunctionCall: TransactionMessageRenderers["FunctionCall"] = React.memo(
  () => {
    // const { t } = useTranslation();
    return <Label type="functionCall">Function Call</Label>;
  }
);

const Transfer: TransactionMessageRenderers["Transfer"] = React.memo(() => {
  // const { t } = useTranslation();
  return <Label type="transfer">Transfer</Label>;
});

const Stake: TransactionMessageRenderers["Stake"] = React.memo(() => {
  // const { t } = useTranslation();
  return <Label type="stake">Restake Tokens</Label>;
});

const AddKey: TransactionMessageRenderers["AddKey"] = React.memo(() => {
  // const { t } = useTranslation();
  return <Label type="addKey">Access Key Added</Label>;
});

const DeleteKey: TransactionMessageRenderers["DeleteKey"] = React.memo(() => {
  // const { t } = useTranslation();
  return <Label type="deleteKey">Access Key Deleted</Label>;
});

const transactionMessageRenderers: TransactionMessageRenderers = {
  CreateAccount,
  DeleteAccount,
  DeployContract,
  FunctionCall,
  Transfer,
  Stake,
  AddKey,
  DeleteKey,
};

const TransactionType: React.FC<Props<Action>> = React.memo((props) => {
  const MessageRenderer = transactionMessageRenderers[props.actionKind];
  if (MessageRenderer === undefined) {
    return <>{props.actionKind}</>;
  }

  return <MessageRenderer {...(props as any)} />;
});

export default TransactionType;
