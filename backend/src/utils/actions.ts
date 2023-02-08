import * as RPC from "@explorer/common/types/rpc";

export type Action =
  | {
      kind: "createAccount";
      args: {};
    }
  | {
      kind: "deployContract";
      args: {
        code: string;
      };
    }
  | {
      kind: "functionCall";
      args: {
        methodName: string;
        args: string;
        gas: number;
        deposit: string;
      };
    }
  | {
      kind: "transfer";
      args: {
        deposit: string;
      };
    }
  | {
      kind: "stake";
      args: {
        stake: string;
        publicKey: string;
      };
    }
  | {
      kind: "addKey";
      args: {
        publicKey: string;
        accessKey: {
          nonce: number;
          permission:
            | {
                type: "fullAccess";
              }
            | {
                type: "functionCall";
                contractId: string;
                methodNames: string[];
              };
        };
      };
    }
  | {
      kind: "deleteKey";
      args: {
        publicKey: string;
      };
    }
  | {
      kind: "deleteAccount";
      args: {
        beneficiaryId: string;
      };
    };

type DatabaseAddKey = {
  kind: "ADD_KEY";
  args: {
    public_key: string;
    access_key: {
      nonce: number;
      permission:
        | {
            permission_kind: "FUNCTION_CALL";
            permission_details: {
              allowance: string;
              receiver_id: string;
              method_names: string[];
            };
          }
        | {
            permission_kind: "FULL_ACCESS";
          };
    };
  };
};

type DatabaseCreateAccount = {
  kind: "CREATE_ACCOUNT";
  args: {};
};

type DatabaseDeleteAccount = {
  kind: "DELETE_ACCOUNT";
  args: {
    beneficiary_id: string;
  };
};

type DatabaseDeleteKey = {
  kind: "DELETE_KEY";
  args: {
    public_key: string;
  };
};

type DatabaseDeployContract = {
  kind: "DEPLOY_CONTRACT";
  args: {
    code_sha256: string;
  };
};

type DatabaseFunctionCall = {
  kind: "FUNCTION_CALL";
  args: {
    gas: number;
    deposit: string;
    method_name: string;
    args_json?: Record<string, unknown>;
    args_base64: string;
  };
};

type DatabaseStake = {
  kind: "STAKE";
  args: {
    public_key: string;
    stake: string;
  };
};

type DatabaseTransfer = {
  kind: "TRANSFER";
  args: {
    deposit: string;
  };
};

export type DatabaseAction = {
  hash: string;
} & (
  | DatabaseAddKey
  | DatabaseCreateAccount
  | DatabaseDeleteAccount
  | DatabaseDeleteKey
  | DatabaseDeployContract
  | DatabaseFunctionCall
  | DatabaseStake
  | DatabaseTransfer
);

export const mapDatabaseActionToAction = (action: DatabaseAction): Action => {
  switch (action.kind) {
    case "ADD_KEY": {
      if (action.args.access_key.permission.permission_kind === "FULL_ACCESS") {
        return {
          kind: "addKey",
          args: {
            publicKey: action.args.public_key,
            accessKey: {
              nonce: action.args.access_key.nonce,
              permission: {
                type: "fullAccess",
              },
            },
          },
        };
      }
      return {
        kind: "addKey",
        args: {
          publicKey: action.args.public_key,
          accessKey: {
            nonce: action.args.access_key.nonce,
            permission: {
              type: "functionCall",
              contractId:
                action.args.access_key.permission.permission_details
                  .receiver_id,
              methodNames:
                action.args.access_key.permission.permission_details
                  .method_names,
            },
          },
        },
      };
    }
    case "CREATE_ACCOUNT":
      return { kind: "createAccount", args: {} };
    case "DELETE_ACCOUNT":
      return {
        kind: "deleteAccount",
        args: {
          beneficiaryId: action.args.beneficiary_id,
        },
      };
    case "DELETE_KEY":
      return {
        kind: "deleteKey",
        args: {
          publicKey: action.args.public_key,
        },
      };
    case "DEPLOY_CONTRACT":
      return {
        kind: "deployContract",
        args: {
          code: action.args.code_sha256,
        },
      };
    case "FUNCTION_CALL":
      return {
        kind: "functionCall",
        args: {
          methodName: action.args.method_name,
          args: action.args.args_base64,
          gas: action.args.gas,
          deposit: action.args.deposit,
        },
      };
    case "STAKE":
      return {
        kind: "stake",
        args: {
          publicKey: action.args.public_key,
          stake: action.args.stake,
        },
      };
    case "TRANSFER":
      return {
        kind: "transfer",
        args: {
          deposit: action.args.deposit,
        },
      };
  }
};

export const mapRpcActionToAction = (rpcAction: RPC.ActionView): Action => {
  if (rpcAction === "CreateAccount") {
    return {
      kind: "createAccount",
      args: {},
    };
  }
  if ("DeployContract" in rpcAction) {
    return {
      kind: "deployContract",
      args: rpcAction.DeployContract,
    };
  }
  if ("FunctionCall" in rpcAction) {
    return {
      kind: "functionCall",
      args: {
        methodName: rpcAction.FunctionCall.method_name,
        args: rpcAction.FunctionCall.args,
        deposit: rpcAction.FunctionCall.deposit,
        gas: rpcAction.FunctionCall.gas,
      },
    };
  }
  if ("Transfer" in rpcAction) {
    return {
      kind: "transfer",
      args: rpcAction.Transfer,
    };
  }
  if ("Stake" in rpcAction) {
    return {
      kind: "stake",
      args: {
        publicKey: rpcAction.Stake.public_key,
        stake: rpcAction.Stake.stake,
      },
    };
  }
  if ("AddKey" in rpcAction) {
    return {
      kind: "addKey",
      args: {
        publicKey: rpcAction.AddKey.public_key,
        accessKey: {
          nonce: rpcAction.AddKey.access_key.nonce,
          permission:
            rpcAction.AddKey.access_key.permission === "FullAccess"
              ? {
                  type: "fullAccess",
                }
              : {
                  type: "functionCall",
                  contractId:
                    rpcAction.AddKey.access_key.permission.FunctionCall
                      .receiver_id,
                  methodNames:
                    rpcAction.AddKey.access_key.permission.FunctionCall
                      .method_names,
                },
        },
      },
    };
  }
  if ("DeleteKey" in rpcAction) {
    return {
      kind: "deleteKey",
      args: {
        publicKey: rpcAction.DeleteKey.public_key,
      },
    };
  }
  return {
    kind: "deleteAccount",
    args: {
      beneficiaryId: rpcAction.DeleteAccount.beneficiary_id,
    },
  };
};
