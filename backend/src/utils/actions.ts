import { Indexer } from "@explorer/backend/database/databases";
import { ActionKind } from "@explorer/backend/database/models/readOnlyIndexer";
import * as RPC from "@explorer/common/types/rpc";
import { notNullishGuard } from "@explorer/common/utils/utils";

type NonDelegateAction =
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

type DelegateAction = {
  kind: "delegateAction";
  args: {
    actions: (NonDelegateAction & { delegateIndex: number })[];
    receiverId: string;
    senderId: string;
  };
};

export type Action = NonDelegateAction | DelegateAction;

type DatabaseType = Indexer.SelectorModelTypeMap["action_receipt_actions"];

type DatabaseArgs = DatabaseType["args"];
type DatabaseDelegateParams = DatabaseType["delegate_parameters"];

type DatabaseAddKeyArgs = Extract<DatabaseArgs, { access_key: unknown }>;
type DatabaseCreateAccountArgs = Extract<DatabaseArgs, Record<string, never>>;
type DatabaseDeleteAccountArgs = Extract<
  DatabaseArgs,
  { beneficiary_id: unknown }
>;
type DatabaseDeleteKeyArgs = Extract<
  Exclude<DatabaseArgs, DatabaseAddKeyArgs | DatabaseStakeArgs>,
  { public_key: unknown }
>;
type DatabaseDeployContractArgs = Extract<
  DatabaseArgs,
  { code_sha256: unknown }
>;
type DatabaseFunctionCallArgs = Extract<DatabaseArgs, { method_name: unknown }>;
type DatabaseStakeArgs = Extract<DatabaseArgs, { stake: unknown }>;
type DatabaseTransferArgs = Extract<
  Exclude<DatabaseArgs, DatabaseFunctionCallArgs>,
  { deposit: unknown }
>;
type DatabaseDelegateArgs = {
  // That is only true after mapping with mapActionResultsWithDelegateActions
  actions: ArgsTuple<WithDelegatedIndex<NonDelegateDatabaseActionMapping>>[];
};

type WithDelegatedIndex<T> = { [K in keyof T]: T & { delegateIndex: number } };

type DatabaseActionMapping = {
  ADD_KEY: DatabaseAddKeyArgs;
  CREATE_ACCOUNT: DatabaseCreateAccountArgs;
  DELETE_ACCOUNT: DatabaseDeleteAccountArgs;
  DELETE_KEY: DatabaseDeleteKeyArgs;
  DEPLOY_CONTRACT: DatabaseDeployContractArgs;
  FUNCTION_CALL: DatabaseFunctionCallArgs;
  STAKE: DatabaseStakeArgs;
  TRANSFER: DatabaseTransferArgs;
  DELEGATE_ACTION: DatabaseDelegateArgs;
};

type NonDelegateDatabaseActionMapping = Omit<
  DatabaseActionMapping,
  "DELEGATE_ACTION"
>;

// Helper that converts DB nested delegate actions (which are separate rows) into actual nested actions
export const mapActionResultsWithDelegateActions = <
  T extends {
    kind: DatabaseType["action_kind"];
    args: DatabaseType["args"];
    delegateParameters: DatabaseType["delegate_parameters"];
    delegateIndex: DatabaseType["delegate_parent_index_in_action_receipt"];
  }
>(
  result: T[],
  isSameOrigin: (a: T, b: T) => boolean
) =>
  result
    .map((action) => {
      if (action.kind === "DELEGATE_ACTION") {
        return {
          ...action,
          args: {
            actions: result
              .filter(
                (lookupAction) =>
                  isSameOrigin(lookupAction, action) &&
                  lookupAction.delegateIndex !== null
              )
              .map((lookupAction) => [
                lookupAction.kind,
                {
                  ...lookupAction.args,
                  delegateIndex: lookupAction.delegateIndex,
                },
              ]),
          },
        };
      }
      if (action.delegateIndex !== null) {
        return null;
      }
      return action;
    })
    .filter(notNullishGuard);

type ArgsTuple<Mapping = DatabaseActionMapping> = {
  [Kind in keyof Mapping]: [Kind, Mapping[Kind]];
}[keyof Mapping];

const mapNonDelegateDatabaseActionToAction = (
  ...[kind, args]: ArgsTuple<NonDelegateDatabaseActionMapping>
): NonDelegateAction => {
  switch (kind) {
    case "ADD_KEY": {
      if (args.access_key.permission.permission_kind === "FULL_ACCESS") {
        return {
          kind: "addKey",
          args: {
            publicKey: args.public_key,
            accessKey: {
              nonce: args.access_key.nonce,
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
          publicKey: args.public_key,
          accessKey: {
            nonce: args.access_key.nonce,
            permission: {
              type: "functionCall",
              contractId:
                args.access_key.permission.permission_details.receiver_id,
              methodNames:
                args.access_key.permission.permission_details.method_names,
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
          beneficiaryId: args.beneficiary_id,
        },
      };
    case "DELETE_KEY":
      return {
        kind: "deleteKey",
        args: {
          publicKey: args.public_key,
        },
      };
    case "DEPLOY_CONTRACT":
      return {
        kind: "deployContract",
        args: {
          code: args.code_sha256,
        },
      };
    case "FUNCTION_CALL":
      return {
        kind: "functionCall",
        args: {
          methodName: args.method_name,
          args: args.args_base64,
          gas: args.gas,
          deposit: args.deposit,
        },
      };
    case "STAKE":
      return {
        kind: "stake",
        args: {
          publicKey: args.public_key,
          stake: args.stake,
        },
      };
    case "TRANSFER":
      return {
        kind: "transfer",
        args: {
          deposit: args.deposit,
        },
      };
  }
};

const mapDatabaseActionToAction = (
  delegateParameters: DatabaseDelegateParams,
  ...[kind, args]: ArgsTuple
): Action => {
  if (kind === "DELEGATE_ACTION") {
    return {
      kind: "delegateAction",
      args: {
        actions: args.actions.map(
          ([subKind, { delegateIndex, ...subArgs }]) => ({
            ...mapNonDelegateDatabaseActionToAction(subKind, subArgs as any),
            delegateIndex,
          })
        ),
        receiverId: delegateParameters!.receiver_id,
        senderId: delegateParameters!.sender_id,
      },
    };
  }
  return mapNonDelegateDatabaseActionToAction(kind, args as any);
};

export const mapForceDatabaseActionToAction = <
  T extends {
    kind: ActionKind;
    args: DatabaseArgs;
    delegateParameters: DatabaseDelegateParams;
  }
>(
  action: T
  // We forcefully cast type as we assume there's always a match in DB between kind and args
) =>
  mapDatabaseActionToAction(
    action.delegateParameters,
    action.kind,
    action.args as any
  );

const mapNonDelegateRpcActionToAction = (
  rpcAction: RPC.NonDelegateActionView
): NonDelegateAction => {
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

export const mapRpcActionToAction = (rpcAction: RPC.ActionView): Action => {
  if (typeof rpcAction === "object" && "Delegate" in rpcAction) {
    return {
      kind: "delegateAction",
      args: {
        actions: rpcAction.Delegate.delegate_action.actions.map(
          (subaction, index) => ({
            ...mapNonDelegateRpcActionToAction(subaction),
            delegateIndex: index,
          })
        ),
        receiverId: rpcAction.Delegate.delegate_action.receiver_id,
        senderId: rpcAction.Delegate.delegate_action.sender_id,
      },
    };
  }
  return mapNonDelegateRpcActionToAction(rpcAction);
};
