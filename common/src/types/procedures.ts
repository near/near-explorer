import { TRPCQueryOutput, TRPCSubscriptionOutput } from "./trpc";

export type AccountOld = NonNullable<TRPCQueryOutput<"account-info">>;
export type Account = NonNullable<TRPCQueryOutput<"account">>;
export type AccountListInfo = TRPCQueryOutput<"accounts-list">[number];
export type AccountFungibleToken =
  TRPCQueryOutput<"account-fungible-tokens">[number];
export type AccountFungibleTokenHistory =
  TRPCQueryOutput<"account-fungible-token-history">;
export type AccountFungibleTokenHistoryElement =
  AccountFungibleTokenHistory["elements"][number];

export type Block = NonNullable<TRPCQueryOutput<"block-info">>;
export type BlockBase = TRPCQueryOutput<"blocks-list">[number];

export type TransactionsHistory = TRPCSubscriptionOutput<"transactionsHistory">;

export type ReceiptExecutionStatus = NonNullable<
  TRPCQueryOutput<"executed-receipts-list-by-block-hash">[number]["status"]
>;
export type Receipt = TRPCQueryOutput<
  | "executed-receipts-list-by-block-hash"
  | "included-receipts-list-by-block-hash"
>[number];

export type TransactionBaseInfo = TRPCQueryOutput<
  | "transactions-list-by-account-id"
  | "transactions-list"
  | "transactions-list-by-block-hash"
>[number];

export type TransactionDetails = NonNullable<TRPCQueryOutput<"transaction">>;

export type Action =
  TRPCQueryOutput<"transactions-list">[number]["actions"][number];
export type NestedReceiptWithOutcome = NonNullable<
  TRPCQueryOutput<"transaction-info">
>["receipt"];
export type Transaction = NonNullable<TRPCQueryOutput<"transaction-info">>;
export type TransactionOutcome = NonNullable<
  TRPCQueryOutput<"transaction-info">
>["transactionOutcome"];

export type DeployInfo = TRPCQueryOutput<"deploy-info">;

export type ValidatorFullData = TRPCSubscriptionOutput<"validators">[number];
export type ValidationProgress = NonNullable<
  ValidatorFullData["currentEpoch"]
>["progress"];
export type ValidatorTelemetry = NonNullable<ValidatorFullData["telemetry"]>;
export type ValidatorDescription = NonNullable<
  ValidatorFullData["description"]
>;
export type ValidatorPoolInfo = NonNullable<ValidatorFullData["poolInfo"]>;

export type HealthStatus = TRPCSubscriptionOutput<"rpcStatus">;
