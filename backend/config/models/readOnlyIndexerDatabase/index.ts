// @generated
// Automatically generated. Don't change this file manually.

import AccessKeys, { AccessKeysInitializer } from "./access-keys";
import AccountChanges, {
  AccountChangesInitializer,
  AccountChangesId,
} from "./account-changes";
import Accounts, { AccountsInitializer, AccountsId } from "./accounts";
import ActionReceiptActions, {
  ActionReceiptActionsInitializer,
} from "./action-receipt-actions";
import ActionReceiptInputData, {
  ActionReceiptInputDataInitializer,
} from "./action-receipt-input-data";
import ActionReceiptOutputData, {
  ActionReceiptOutputDataInitializer,
} from "./action-receipt-output-data";
import ActionReceipts, {
  ActionReceiptsInitializer,
  ActionReceiptsId,
} from "./action-receipts";
import AggregatedCirculatingSupply, {
  AggregatedCirculatingSupplyInitializer,
  AggregatedCirculatingSupplyId,
} from "./aggregated-circulating-supply";
import AssetsFungibleTokenEvents, {
  AssetsFungibleTokenEventsInitializer,
} from "./assets-fungible-token-events";
import AssetsNonFungibleTokenEvents, {
  AssetsNonFungibleTokenEventsInitializer,
} from "./assets-non-fungible-token-events";
import Blocks, { BlocksInitializer, BlocksId } from "./blocks";
import Chunks, { ChunksInitializer, ChunksId } from "./chunks";
import DataReceipts, {
  DataReceiptsInitializer,
  DataReceiptsId,
} from "./data-receipts";
import ExecutionOutcomeReceipts, {
  ExecutionOutcomeReceiptsInitializer,
} from "./execution-outcome-receipts";
import ExecutionOutcomes, {
  ExecutionOutcomesInitializer,
  ExecutionOutcomesId,
} from "./execution-outcomes";
import Receipts, { ReceiptsInitializer, ReceiptsId } from "./receipts";
import TransactionActions, {
  TransactionActionsInitializer,
} from "./transaction-actions";
import Transactions, {
  TransactionsInitializer,
  TransactionsId,
} from "./transactions";
import AggregatedLockups from "./aggregated-lockups";
import AccessKeyPermissionKind from "./access-key-permission-kind";
import ActionKind from "./action-kind";
import ExecutionOutcomeStatus from "./execution-outcome-status";
import FtEventKind from "./ft-event-kind";
import NftEventKind from "./nft-event-kind";
import ReceiptKind from "./receipt-kind";
import StateChangeReasonKind from "./state-change-reason-kind";

type Model =
  | AccessKeys
  | AccountChanges
  | Accounts
  | ActionReceiptActions
  | ActionReceiptInputData
  | ActionReceiptOutputData
  | ActionReceipts
  | AggregatedCirculatingSupply
  | AssetsFungibleTokenEvents
  | AssetsNonFungibleTokenEvents
  | Blocks
  | Chunks
  | DataReceipts
  | ExecutionOutcomeReceipts
  | ExecutionOutcomes
  | Receipts
  | TransactionActions
  | Transactions
  | AggregatedLockups;

interface ModelTypeMap {
  access_keys: AccessKeys;
  account_changes: AccountChanges;
  accounts: Accounts;
  action_receipt_actions: ActionReceiptActions;
  action_receipt_input_data: ActionReceiptInputData;
  action_receipt_output_data: ActionReceiptOutputData;
  action_receipts: ActionReceipts;
  aggregated__circulating_supply: AggregatedCirculatingSupply;
  assets__fungible_token_events: AssetsFungibleTokenEvents;
  assets__non_fungible_token_events: AssetsNonFungibleTokenEvents;
  blocks: Blocks;
  chunks: Chunks;
  data_receipts: DataReceipts;
  execution_outcome_receipts: ExecutionOutcomeReceipts;
  execution_outcomes: ExecutionOutcomes;
  receipts: Receipts;
  transaction_actions: TransactionActions;
  transactions: Transactions;
  aggregated__lockups: AggregatedLockups;
}

type ModelId =
  | AccountChangesId
  | AccountsId
  | ActionReceiptsId
  | AggregatedCirculatingSupplyId
  | BlocksId
  | ChunksId
  | DataReceiptsId
  | ExecutionOutcomesId
  | ReceiptsId
  | TransactionsId;

interface ModelIdTypeMap {
  account_changes: AccountChangesId;
  accounts: AccountsId;
  action_receipts: ActionReceiptsId;
  aggregated__circulating_supply: AggregatedCirculatingSupplyId;
  blocks: BlocksId;
  chunks: ChunksId;
  data_receipts: DataReceiptsId;
  execution_outcomes: ExecutionOutcomesId;
  receipts: ReceiptsId;
  transactions: TransactionsId;
}

type Initializer =
  | AccessKeysInitializer
  | AccountChangesInitializer
  | AccountsInitializer
  | ActionReceiptActionsInitializer
  | ActionReceiptInputDataInitializer
  | ActionReceiptOutputDataInitializer
  | ActionReceiptsInitializer
  | AggregatedCirculatingSupplyInitializer
  | AssetsFungibleTokenEventsInitializer
  | AssetsNonFungibleTokenEventsInitializer
  | BlocksInitializer
  | ChunksInitializer
  | DataReceiptsInitializer
  | ExecutionOutcomeReceiptsInitializer
  | ExecutionOutcomesInitializer
  | ReceiptsInitializer
  | TransactionActionsInitializer
  | TransactionsInitializer;

interface InitializerTypeMap {
  access_keys: AccessKeysInitializer;
  account_changes: AccountChangesInitializer;
  accounts: AccountsInitializer;
  action_receipt_actions: ActionReceiptActionsInitializer;
  action_receipt_input_data: ActionReceiptInputDataInitializer;
  action_receipt_output_data: ActionReceiptOutputDataInitializer;
  action_receipts: ActionReceiptsInitializer;
  aggregated__circulating_supply: AggregatedCirculatingSupplyInitializer;
  assets__fungible_token_events: AssetsFungibleTokenEventsInitializer;
  assets__non_fungible_token_events: AssetsNonFungibleTokenEventsInitializer;
  blocks: BlocksInitializer;
  chunks: ChunksInitializer;
  data_receipts: DataReceiptsInitializer;
  execution_outcome_receipts: ExecutionOutcomeReceiptsInitializer;
  execution_outcomes: ExecutionOutcomesInitializer;
  receipts: ReceiptsInitializer;
  transaction_actions: TransactionActionsInitializer;
  transactions: TransactionsInitializer;
}

export type {
  AccessKeys,
  AccessKeysInitializer,
  AccountChanges,
  AccountChangesInitializer,
  AccountChangesId,
  Accounts,
  AccountsInitializer,
  AccountsId,
  ActionReceiptActions,
  ActionReceiptActionsInitializer,
  ActionReceiptInputData,
  ActionReceiptInputDataInitializer,
  ActionReceiptOutputData,
  ActionReceiptOutputDataInitializer,
  ActionReceipts,
  ActionReceiptsInitializer,
  ActionReceiptsId,
  AggregatedCirculatingSupply,
  AggregatedCirculatingSupplyInitializer,
  AggregatedCirculatingSupplyId,
  AssetsFungibleTokenEvents,
  AssetsFungibleTokenEventsInitializer,
  AssetsNonFungibleTokenEvents,
  AssetsNonFungibleTokenEventsInitializer,
  Blocks,
  BlocksInitializer,
  BlocksId,
  Chunks,
  ChunksInitializer,
  ChunksId,
  DataReceipts,
  DataReceiptsInitializer,
  DataReceiptsId,
  ExecutionOutcomeReceipts,
  ExecutionOutcomeReceiptsInitializer,
  ExecutionOutcomes,
  ExecutionOutcomesInitializer,
  ExecutionOutcomesId,
  Receipts,
  ReceiptsInitializer,
  ReceiptsId,
  TransactionActions,
  TransactionActionsInitializer,
  Transactions,
  TransactionsInitializer,
  TransactionsId,
  AggregatedLockups,
  AccessKeyPermissionKind,
  ActionKind,
  ExecutionOutcomeStatus,
  FtEventKind,
  NftEventKind,
  ReceiptKind,
  StateChangeReasonKind,
  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap,
};
