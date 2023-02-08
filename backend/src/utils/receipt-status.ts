import { ExecutionOutcomeStatus } from "@explorer/backend/database/models/readOnlyIndexer";
import * as RPC from "@explorer/common/types/rpc";

type UnknownError = { type: "unknown" };

const UNKNOWN_ERROR: UnknownError = { type: "unknown" };

type FunctionCallError =
  | {
      type: "compilationError";
      error: CompilationError;
    }
  | { type: "linkError"; msg: string }
  | { type: "methodResolveError" }
  | { type: "wasmTrap" }
  | { type: "wasmUnknownError" }
  | { type: "hostError" }
  | { type: "evmError" }
  | { type: "executionError"; error: string }
  | UnknownError;

type NewReceiptValidationError =
  | { type: "invalidPredecessorId"; accountId: String }
  | { type: "invalidReceiverId"; accountId: String }
  | { type: "invalidSignerId"; accountId: String }
  | { type: "invalidDataReceiverId"; accountId: String }
  | { type: "returnedValueLengthExceeded"; length: number; limit: number }
  | {
      type: "numberInputDataDependenciesExceeded";
      numberOfInputDataDependencies: number;
      limit: number;
    }
  | { type: "actionsValidation" }
  | UnknownError;

type CompilationError =
  | { type: "codeDoesNotExist"; accountId: string }
  | { type: "prepareError" }
  | { type: "wasmerCompileError"; msg: string }
  | { type: "unsupportedCompiler"; msg: string }
  | UnknownError;

type ReceiptActionError =
  | {
      type: "accountAlreadyExists";
      accountId: string;
    }
  | {
      type: "accountDoesNotExist";
      accountId: string;
    }
  | {
      type: "createAccountOnlyByRegistrar";
      accountId: string;
      registrarAccountId: string;
      predecessorId: string;
    }
  | {
      type: "createAccountNotAllowed";
      accountId: string;
      predecessorId: string;
    }
  | {
      type: "actorNoPermission";
      accountId: string;
      actorId: string;
    }
  | {
      type: "deleteKeyDoesNotExist";
      accountId: string;
      publicKey: string;
    }
  | {
      type: "addKeyAlreadyExists";
      accountId: string;
      publicKey: string;
    }
  | {
      type: "deleteAccountStaking";
      accountId: string;
    }
  | {
      type: "lackBalanceForState";
      accountId: string;
      amount: string;
    }
  | {
      type: "triesToUnstake";
      accountId: string;
    }
  | {
      type: "triesToStake";
      accountId: string;
      stake: string;
      locked: string;
      balance: string;
    }
  | {
      type: "insufficientStake";
      accountId: string;
      stake: string;
      minimumStake: string;
    }
  | {
      type: "functionCallError";
      error: FunctionCallError;
    }
  | {
      type: "newReceiptValidationError";
      error: NewReceiptValidationError;
    }
  | { type: "onlyImplicitAccountCreationAllowed"; accountId: string }
  | { type: "deleteAccountWithLargeState"; accountId: string }
  | UnknownError;

type ReceiptTransactionError =
  | { type: "invalidAccessKeyError" }
  | { type: "invalidSignerId"; signerId: string }
  | { type: "signerDoesNotExist"; signerId: string }
  | { type: "invalidNonce"; transactionNonce: number; akNonce: number }
  | { type: "nonceTooLarge"; transactionNonce: number; upperBound: number }
  | { type: "invalidReceiverId"; receiverId: string }
  | { type: "invalidSignature" }
  | {
      type: "notEnoughBalance";
      signerId: string;
      balance: string;
      cost: string;
    }
  | { type: "lackBalanceForState"; signerId: string; amount: string }
  | { type: "costOverflow" }
  | { type: "invalidChain" }
  | { type: "expired" }
  | { type: "actionsValidation" }
  | { type: "transactionSizeExceeded"; size: number; limit: number }
  | UnknownError;

type ReceiptExecutionStatusError =
  | {
      type: "action";
      error: ReceiptActionError;
    }
  | {
      type: "transaction";
      error: ReceiptTransactionError;
    }
  | UnknownError;

export type ReceiptExecutionStatus =
  | {
      type: "failure";
      error: ReceiptExecutionStatusError;
    }
  | {
      type: "successValue";
      value: string;
    }
  | {
      type: "successReceiptId";
      receiptId: string;
    }
  | {
      type: "unknown";
    };

const mapRpcCompilationError = (
  error: RPC.CompilationError
): CompilationError => {
  if ("CodeDoesNotExist" in error) {
    return {
      type: "codeDoesNotExist",
      accountId: error.CodeDoesNotExist.account_id,
    };
  }
  if ("PrepareError" in error) {
    return {
      type: "prepareError",
    };
  }
  if ("WasmerCompileError" in error) {
    return {
      type: "wasmerCompileError",
      msg: error.WasmerCompileError.msg,
    };
  }
  if ("UnsupportedCompiler" in error) {
    return {
      type: "unsupportedCompiler",
      msg: error.UnsupportedCompiler.msg,
    };
  }
  return UNKNOWN_ERROR;
};

const mapRpcFunctionCallError = (
  error: RPC.FunctionCallError
): FunctionCallError => {
  if ("CompilationError" in error) {
    return {
      type: "compilationError",
      error: mapRpcCompilationError(error.CompilationError),
    };
  }
  if ("LinkError" in error) {
    return {
      type: "linkError",
      msg: error.LinkError.msg,
    };
  }
  if ("MethodResolveError" in error) {
    return {
      type: "methodResolveError",
    };
  }
  if ("WasmTrap" in error) {
    return {
      type: "wasmTrap",
    };
  }
  if ("WasmUnknownError" in error) {
    return {
      type: "wasmUnknownError",
    };
  }
  if ("HostError" in error) {
    return {
      type: "hostError",
    };
  }
  if ("_EVMError" in error) {
    return {
      type: "evmError",
    };
  }
  if ("ExecutionError" in error) {
    return {
      type: "executionError",
      error: error.ExecutionError,
    };
  }
  return UNKNOWN_ERROR;
};
const mapRpcNewReceiptValidationError = (
  error: RPC.NewReceiptValidationError
): NewReceiptValidationError => {
  if ("InvalidPredecessorId" in error) {
    return {
      type: "invalidPredecessorId",
      accountId: error.InvalidPredecessorId.account_id,
    };
  }
  if ("InvalidReceiverId" in error) {
    return {
      type: "invalidReceiverId",
      accountId: error.InvalidReceiverId.account_id,
    };
  }
  if ("InvalidSignerId" in error) {
    return {
      type: "invalidSignerId",
      accountId: error.InvalidSignerId.account_id,
    };
  }
  if ("InvalidDataReceiverId" in error) {
    return {
      type: "invalidDataReceiverId",
      accountId: error.InvalidDataReceiverId.account_id,
    };
  }
  if ("ReturnedValueLengthExceeded" in error) {
    return {
      type: "returnedValueLengthExceeded",
      length: error.ReturnedValueLengthExceeded.length,
      limit: error.ReturnedValueLengthExceeded.limit,
    };
  }
  if ("NumberInputDataDependenciesExceeded" in error) {
    return {
      type: "numberInputDataDependenciesExceeded",
      numberOfInputDataDependencies:
        error.NumberInputDataDependenciesExceeded
          .number_of_input_data_dependencies,
      limit: error.NumberInputDataDependenciesExceeded.limit,
    };
  }
  if ("ActionsValidation" in error) {
    return {
      type: "actionsValidation",
    };
  }
  return UNKNOWN_ERROR;
};

const mapRpcReceiptError = (
  error: RPC.TxExecutionError
): ReceiptExecutionStatusError => {
  if ("ActionError" in error) {
    return {
      type: "action",
      error: mapRpcReceiptActionError(error.ActionError),
    };
  }
  if ("InvalidTxError" in error) {
    return {
      type: "transaction",
      error: mapRpcReceiptInvalidTxError(error.InvalidTxError),
    };
  }
  return UNKNOWN_ERROR;
};

const mapRpcReceiptInvalidTxError = (
  error: RPC.InvalidTxError
): ReceiptTransactionError => {
  if ("InvalidAccessKeyError" in error) {
    return {
      type: "invalidAccessKeyError",
    };
  }
  if ("InvalidSignerId" in error) {
    return {
      type: "invalidSignerId",
      signerId: error.InvalidSignerId.signer_id,
    };
  }
  if ("SignerDoesNotExist" in error) {
    return {
      type: "signerDoesNotExist",
      signerId: error.SignerDoesNotExist.signer_id,
    };
  }
  if ("InvalidNonce" in error) {
    return {
      type: "invalidNonce",
      transactionNonce: error.InvalidNonce.tx_nonce,
      akNonce: error.InvalidNonce.ak_nonce,
    };
  }
  if ("NonceTooLarge" in error) {
    return {
      type: "nonceTooLarge",
      transactionNonce: error.NonceTooLarge.tx_nonce,
      upperBound: error.NonceTooLarge.upper_bound,
    };
  }
  if ("InvalidReceiverId" in error) {
    return {
      type: "invalidReceiverId",
      receiverId: error.InvalidReceiverId.receiver_id,
    };
  }
  if ("InvalidSignature" in error) {
    return {
      type: "invalidSignature",
    };
  }
  if ("NotEnoughBalance" in error) {
    return {
      type: "notEnoughBalance",
      signerId: error.NotEnoughBalance.signer_id,
      balance: error.NotEnoughBalance.balance,
      cost: error.NotEnoughBalance.cost,
    };
  }
  if ("LackBalanceForState" in error) {
    return {
      type: "lackBalanceForState",
      signerId: error.LackBalanceForState.signer_id,
      amount: error.LackBalanceForState.amount,
    };
  }
  if ("CostOverflow" in error) {
    return {
      type: "costOverflow",
    };
  }
  if ("InvalidChain" in error) {
    return {
      type: "invalidChain",
    };
  }
  if ("Expired" in error) {
    return {
      type: "expired",
    };
  }
  if ("ActionsValidation" in error) {
    return {
      type: "actionsValidation",
    };
  }
  if ("TransactionSizeExceeded" in error) {
    return {
      type: "transactionSizeExceeded",
      size: error.TransactionSizeExceeded.size,
      limit: error.TransactionSizeExceeded.limit,
    };
  }
  return UNKNOWN_ERROR;
};

const mapRpcReceiptActionError = (
  error: RPC.ActionError
): ReceiptActionError => {
  const { kind } = error;
  if ("AccountAlreadyExists" in kind) {
    return {
      type: "accountAlreadyExists",
      accountId: kind.AccountAlreadyExists.account_id,
    };
  }
  if ("AccountDoesNotExist" in kind) {
    return {
      type: "accountDoesNotExist",
      accountId: kind.AccountDoesNotExist.account_id,
    };
  }
  if ("CreateAccountOnlyByRegistrar" in kind) {
    return {
      type: "createAccountOnlyByRegistrar",
      accountId: kind.CreateAccountOnlyByRegistrar.account_id,
      registrarAccountId:
        kind.CreateAccountOnlyByRegistrar.registrar_account_id,
      predecessorId: kind.CreateAccountOnlyByRegistrar.predecessor_id,
    };
  }
  if ("CreateAccountNotAllowed" in kind) {
    return {
      type: "createAccountNotAllowed",
      accountId: kind.CreateAccountNotAllowed.account_id,
      predecessorId: kind.CreateAccountNotAllowed.predecessor_id,
    };
  }
  if ("ActorNoPermission" in kind) {
    return {
      type: "actorNoPermission",
      accountId: kind.ActorNoPermission.account_id,
      actorId: kind.ActorNoPermission.actor_id,
    };
  }
  if ("DeleteKeyDoesNotExist" in kind) {
    return {
      type: "deleteKeyDoesNotExist",
      accountId: kind.DeleteKeyDoesNotExist.account_id,
      publicKey: kind.DeleteKeyDoesNotExist.public_key,
    };
  }
  if ("AddKeyAlreadyExists" in kind) {
    return {
      type: "addKeyAlreadyExists",
      accountId: kind.AddKeyAlreadyExists.account_id,
      publicKey: kind.AddKeyAlreadyExists.public_key,
    };
  }
  if ("DeleteAccountStaking" in kind) {
    return {
      type: "deleteAccountStaking",
      accountId: kind.DeleteAccountStaking.account_id,
    };
  }
  if ("LackBalanceForState" in kind) {
    return {
      type: "lackBalanceForState",
      accountId: kind.LackBalanceForState.account_id,
      amount: kind.LackBalanceForState.amount,
    };
  }
  if ("TriesToUnstake" in kind) {
    return {
      type: "triesToUnstake",
      accountId: kind.TriesToUnstake.account_id,
    };
  }
  if ("TriesToStake" in kind) {
    return {
      type: "triesToStake",
      accountId: kind.TriesToStake.account_id,
      stake: kind.TriesToStake.stake,
      locked: kind.TriesToStake.locked,
      balance: kind.TriesToStake.balance,
    };
  }
  if ("InsufficientStake" in kind) {
    return {
      type: "insufficientStake",
      accountId: kind.InsufficientStake.account_id,
      stake: kind.InsufficientStake.stake,
      minimumStake: kind.InsufficientStake.minimum_stake,
    };
  }
  if ("FunctionCallError" in kind) {
    return {
      type: "functionCallError",
      error: mapRpcFunctionCallError(kind.FunctionCallError),
    };
  }
  if ("NewReceiptValidationError" in kind) {
    return {
      type: "newReceiptValidationError",
      error: mapRpcNewReceiptValidationError(kind.NewReceiptValidationError),
    };
  }
  if ("OnlyImplicitAccountCreationAllowed" in kind) {
    return {
      type: "onlyImplicitAccountCreationAllowed",
      accountId: kind.OnlyImplicitAccountCreationAllowed.account_id,
    };
  }
  if ("DeleteAccountWithLargeState" in kind) {
    return {
      type: "deleteAccountWithLargeState",
      accountId: kind.DeleteAccountWithLargeState.account_id,
    };
  }
  return UNKNOWN_ERROR;
};

export const mapRpcReceiptStatus = (
  status: RPC.ExecutionStatusView
): ReceiptExecutionStatus => {
  if ("SuccessValue" in status) {
    return { type: "successValue", value: status.SuccessValue };
  }
  if ("SuccessReceiptId" in status) {
    return { type: "successReceiptId", receiptId: status.SuccessReceiptId };
  }
  if ("Failure" in status) {
    return { type: "failure", error: mapRpcReceiptError(status.Failure) };
  }
  return { type: "unknown" };
};

export const mapDatabaseReceiptStatus = (
  status: ExecutionOutcomeStatus
): ReceiptExecutionStatus["type"] => {
  switch (status) {
    case "SUCCESS_RECEIPT_ID":
      return "successReceiptId";
    case "SUCCESS_VALUE":
      return "successValue";
    case "FAILURE":
      return "failure";
    default:
      return "unknown";
  }
};
