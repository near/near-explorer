import { TRPCQueryOutput, TRPCSubscriptionOutput } from "./trpc";

export type AccountOld = NonNullable<TRPCQueryOutput<"account.byIdOld">>;
export type Account = NonNullable<TRPCQueryOutput<"account.byId">>;
export type AccountListInfo =
  TRPCQueryOutput<"account.listByTimestamp">[number];
export type AccountFungibleToken =
  TRPCQueryOutput<"account.fungibleTokens">[number];
export type AccountFungibleTokenHistory =
  TRPCQueryOutput<"account.fungibleTokenHistory">;
export type AccountFungibleTokenHistoryElement =
  AccountFungibleTokenHistory["elements"][number];

export type AccountActivity = TRPCQueryOutput<"account.activity">;
export type AccountActivityElement = AccountActivity["items"][number];
export type AccountActivityElementAction = AccountActivityElement["action"];
export type AccountActivityRelatedAction = NonNullable<
  AccountActivityElement["action"]["parentAction"]
>;
type InferAccountActivityAction<T extends AccountActivityElementAction> =
  T extends { kind: "batch" } ? T["actions"][number] : never;
export type AccountActivityAction =
  InferAccountActivityAction<AccountActivityElementAction>;

export type Block = NonNullable<TRPCQueryOutput<"block.byId">>;
export type BlockBase = TRPCQueryOutput<"block.list">[number];

export type ReceiptExecutionStatus = NonNullable<
  TRPCQueryOutput<"receipt.listExecutedByBlockHash">[number]["status"]
>;
export type Receipt = TRPCQueryOutput<
  "receipt.listExecutedByBlockHash" | "receipt.listIncludedByBlockHash"
>[number];

export type TransactionListResponse = TRPCQueryOutput<
  | "transaction.listByAccountId"
  | "transaction.listByTimestamp"
  | "transaction.listByBlockHash"
>;
export type TransactionPreview = TransactionListResponse["items"][number];

export type Transaction = NonNullable<TRPCQueryOutput<"transaction.byHash">>;
export type TransactionStatus = Transaction["status"];
export type TransactionReceipt = Transaction["receipt"];

export type Action = TransactionPreview["actions"][number];
export type TransactionOld = NonNullable<
  TRPCQueryOutput<"transaction.byHashOld">
>;
export type NestedReceiptWithOutcome = TransactionOld["receipt"];
export type TransactionOutcome = TransactionOld["outcome"];

export type FungibleTokenItem = TRPCQueryOutput<"fungibleTokens.list">[number];

export type DeployInfo = TRPCQueryOutput<"utils.deployInfo">;

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
