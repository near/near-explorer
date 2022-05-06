// @generated
// Automatically generated. Don't change this file manually.

import DailyAccountsAddedPerEcosystemEntity, {
  DailyAccountsAddedPerEcosystemEntityInitializer,
} from "./daily-accounts-added-per-ecosystem-entity";
import DailyActiveAccountsCount, {
  DailyActiveAccountsCountInitializer,
  DailyActiveAccountsCountId,
} from "./daily-active-accounts-count";
import DailyActiveContractsCount, {
  DailyActiveContractsCountInitializer,
  DailyActiveContractsCountId,
} from "./daily-active-contracts-count";
import DailyDeletedAccountsCount, {
  DailyDeletedAccountsCountInitializer,
  DailyDeletedAccountsCountId,
} from "./daily-deleted-accounts-count";
import DailyDepositAmount, {
  DailyDepositAmountInitializer,
  DailyDepositAmountId,
} from "./daily-deposit-amount";
import DailyGasUsed, {
  DailyGasUsedInitializer,
  DailyGasUsedId,
} from "./daily-gas-used";
import DailyIngoingTransactionsPerAccountCount, {
  DailyIngoingTransactionsPerAccountCountInitializer,
} from "./daily-ingoing-transactions-per-account-count";
import DailyNewAccountsCount, {
  DailyNewAccountsCountInitializer,
  DailyNewAccountsCountId,
} from "./daily-new-accounts-count";
import DailyNewAccountsPerEcosystemEntityCount, {
  DailyNewAccountsPerEcosystemEntityCountInitializer,
} from "./daily-new-accounts-per-ecosystem-entity-count";
import DailyNewContractsCount, {
  DailyNewContractsCountInitializer,
  DailyNewContractsCountId,
} from "./daily-new-contracts-count";
import DailyNewUniqueContractsCount, {
  DailyNewUniqueContractsCountInitializer,
  DailyNewUniqueContractsCountId,
} from "./daily-new-unique-contracts-count";
import DailyOutgoingTransactionsPerAccountCount, {
  DailyOutgoingTransactionsPerAccountCountInitializer,
} from "./daily-outgoing-transactions-per-account-count";
import DailyReceiptsPerContractCount, {
  DailyReceiptsPerContractCountInitializer,
} from "./daily-receipts-per-contract-count";
import DailyTokensSpentOnFees, {
  DailyTokensSpentOnFeesInitializer,
  DailyTokensSpentOnFeesId,
} from "./daily-tokens-spent-on-fees";
import DailyTransactionCountByGasBurntRanges, {
  DailyTransactionCountByGasBurntRangesInitializer,
} from "./daily-transaction-count-by-gas-burnt-ranges";
import DailyTransactionsCount, {
  DailyTransactionsCountInitializer,
  DailyTransactionsCountId,
} from "./daily-transactions-count";
import DeployedContracts, {
  DeployedContractsInitializer,
  DeployedContractsId,
} from "./deployed-contracts";
import NearEcosystemEntities, {
  NearEcosystemEntitiesInitializer,
  NearEcosystemEntitiesId,
} from "./near-ecosystem-entities";
import TransactionsWithConvertedReceipts, {
  TransactionsWithConvertedReceiptsInitializer,
} from "./transactions-with-converted-receipts";
import WeeklyActiveAccountsCount, {
  WeeklyActiveAccountsCountInitializer,
  WeeklyActiveAccountsCountId,
} from "./weekly-active-accounts-count";

type Model =
  | DailyAccountsAddedPerEcosystemEntity
  | DailyActiveAccountsCount
  | DailyActiveContractsCount
  | DailyDeletedAccountsCount
  | DailyDepositAmount
  | DailyGasUsed
  | DailyIngoingTransactionsPerAccountCount
  | DailyNewAccountsCount
  | DailyNewAccountsPerEcosystemEntityCount
  | DailyNewContractsCount
  | DailyNewUniqueContractsCount
  | DailyOutgoingTransactionsPerAccountCount
  | DailyReceiptsPerContractCount
  | DailyTokensSpentOnFees
  | DailyTransactionCountByGasBurntRanges
  | DailyTransactionsCount
  | DeployedContracts
  | NearEcosystemEntities
  | TransactionsWithConvertedReceipts
  | WeeklyActiveAccountsCount;

interface ModelTypeMap {
  daily_accounts_added_per_ecosystem_entity: DailyAccountsAddedPerEcosystemEntity;
  daily_active_accounts_count: DailyActiveAccountsCount;
  daily_active_contracts_count: DailyActiveContractsCount;
  daily_deleted_accounts_count: DailyDeletedAccountsCount;
  daily_deposit_amount: DailyDepositAmount;
  daily_gas_used: DailyGasUsed;
  daily_ingoing_transactions_per_account_count: DailyIngoingTransactionsPerAccountCount;
  daily_new_accounts_count: DailyNewAccountsCount;
  daily_new_accounts_per_ecosystem_entity_count: DailyNewAccountsPerEcosystemEntityCount;
  daily_new_contracts_count: DailyNewContractsCount;
  daily_new_unique_contracts_count: DailyNewUniqueContractsCount;
  daily_outgoing_transactions_per_account_count: DailyOutgoingTransactionsPerAccountCount;
  daily_receipts_per_contract_count: DailyReceiptsPerContractCount;
  daily_tokens_spent_on_fees: DailyTokensSpentOnFees;
  daily_transaction_count_by_gas_burnt_ranges: DailyTransactionCountByGasBurntRanges;
  daily_transactions_count: DailyTransactionsCount;
  deployed_contracts: DeployedContracts;
  near_ecosystem_entities: NearEcosystemEntities;
  transactions_with_converted_receipts: TransactionsWithConvertedReceipts;
  weekly_active_accounts_count: WeeklyActiveAccountsCount;
}

type ModelId =
  | DailyActiveAccountsCountId
  | DailyActiveContractsCountId
  | DailyDeletedAccountsCountId
  | DailyDepositAmountId
  | DailyGasUsedId
  | DailyNewAccountsCountId
  | DailyNewContractsCountId
  | DailyNewUniqueContractsCountId
  | DailyTokensSpentOnFeesId
  | DailyTransactionsCountId
  | DeployedContractsId
  | NearEcosystemEntitiesId
  | WeeklyActiveAccountsCountId;

interface ModelIdTypeMap {
  daily_active_accounts_count: DailyActiveAccountsCountId;
  daily_active_contracts_count: DailyActiveContractsCountId;
  daily_deleted_accounts_count: DailyDeletedAccountsCountId;
  daily_deposit_amount: DailyDepositAmountId;
  daily_gas_used: DailyGasUsedId;
  daily_new_accounts_count: DailyNewAccountsCountId;
  daily_new_contracts_count: DailyNewContractsCountId;
  daily_new_unique_contracts_count: DailyNewUniqueContractsCountId;
  daily_tokens_spent_on_fees: DailyTokensSpentOnFeesId;
  daily_transactions_count: DailyTransactionsCountId;
  deployed_contracts: DeployedContractsId;
  near_ecosystem_entities: NearEcosystemEntitiesId;
  weekly_active_accounts_count: WeeklyActiveAccountsCountId;
}

type Initializer =
  | DailyAccountsAddedPerEcosystemEntityInitializer
  | DailyActiveAccountsCountInitializer
  | DailyActiveContractsCountInitializer
  | DailyDeletedAccountsCountInitializer
  | DailyDepositAmountInitializer
  | DailyGasUsedInitializer
  | DailyIngoingTransactionsPerAccountCountInitializer
  | DailyNewAccountsCountInitializer
  | DailyNewAccountsPerEcosystemEntityCountInitializer
  | DailyNewContractsCountInitializer
  | DailyNewUniqueContractsCountInitializer
  | DailyOutgoingTransactionsPerAccountCountInitializer
  | DailyReceiptsPerContractCountInitializer
  | DailyTokensSpentOnFeesInitializer
  | DailyTransactionCountByGasBurntRangesInitializer
  | DailyTransactionsCountInitializer
  | DeployedContractsInitializer
  | NearEcosystemEntitiesInitializer
  | TransactionsWithConvertedReceiptsInitializer
  | WeeklyActiveAccountsCountInitializer;

interface InitializerTypeMap {
  daily_accounts_added_per_ecosystem_entity: DailyAccountsAddedPerEcosystemEntityInitializer;
  daily_active_accounts_count: DailyActiveAccountsCountInitializer;
  daily_active_contracts_count: DailyActiveContractsCountInitializer;
  daily_deleted_accounts_count: DailyDeletedAccountsCountInitializer;
  daily_deposit_amount: DailyDepositAmountInitializer;
  daily_gas_used: DailyGasUsedInitializer;
  daily_ingoing_transactions_per_account_count: DailyIngoingTransactionsPerAccountCountInitializer;
  daily_new_accounts_count: DailyNewAccountsCountInitializer;
  daily_new_accounts_per_ecosystem_entity_count: DailyNewAccountsPerEcosystemEntityCountInitializer;
  daily_new_contracts_count: DailyNewContractsCountInitializer;
  daily_new_unique_contracts_count: DailyNewUniqueContractsCountInitializer;
  daily_outgoing_transactions_per_account_count: DailyOutgoingTransactionsPerAccountCountInitializer;
  daily_receipts_per_contract_count: DailyReceiptsPerContractCountInitializer;
  daily_tokens_spent_on_fees: DailyTokensSpentOnFeesInitializer;
  daily_transaction_count_by_gas_burnt_ranges: DailyTransactionCountByGasBurntRangesInitializer;
  daily_transactions_count: DailyTransactionsCountInitializer;
  deployed_contracts: DeployedContractsInitializer;
  near_ecosystem_entities: NearEcosystemEntitiesInitializer;
  transactions_with_converted_receipts: TransactionsWithConvertedReceiptsInitializer;
  weekly_active_accounts_count: WeeklyActiveAccountsCountInitializer;
}

export type {
  DailyAccountsAddedPerEcosystemEntity,
  DailyAccountsAddedPerEcosystemEntityInitializer,
  DailyActiveAccountsCount,
  DailyActiveAccountsCountInitializer,
  DailyActiveAccountsCountId,
  DailyActiveContractsCount,
  DailyActiveContractsCountInitializer,
  DailyActiveContractsCountId,
  DailyDeletedAccountsCount,
  DailyDeletedAccountsCountInitializer,
  DailyDeletedAccountsCountId,
  DailyDepositAmount,
  DailyDepositAmountInitializer,
  DailyDepositAmountId,
  DailyGasUsed,
  DailyGasUsedInitializer,
  DailyGasUsedId,
  DailyIngoingTransactionsPerAccountCount,
  DailyIngoingTransactionsPerAccountCountInitializer,
  DailyNewAccountsCount,
  DailyNewAccountsCountInitializer,
  DailyNewAccountsCountId,
  DailyNewAccountsPerEcosystemEntityCount,
  DailyNewAccountsPerEcosystemEntityCountInitializer,
  DailyNewContractsCount,
  DailyNewContractsCountInitializer,
  DailyNewContractsCountId,
  DailyNewUniqueContractsCount,
  DailyNewUniqueContractsCountInitializer,
  DailyNewUniqueContractsCountId,
  DailyOutgoingTransactionsPerAccountCount,
  DailyOutgoingTransactionsPerAccountCountInitializer,
  DailyReceiptsPerContractCount,
  DailyReceiptsPerContractCountInitializer,
  DailyTokensSpentOnFees,
  DailyTokensSpentOnFeesInitializer,
  DailyTokensSpentOnFeesId,
  DailyTransactionCountByGasBurntRanges,
  DailyTransactionCountByGasBurntRangesInitializer,
  DailyTransactionsCount,
  DailyTransactionsCountInitializer,
  DailyTransactionsCountId,
  DeployedContracts,
  DeployedContractsInitializer,
  DeployedContractsId,
  NearEcosystemEntities,
  NearEcosystemEntitiesInitializer,
  NearEcosystemEntitiesId,
  TransactionsWithConvertedReceipts,
  TransactionsWithConvertedReceiptsInitializer,
  WeeklyActiveAccountsCount,
  WeeklyActiveAccountsCountInitializer,
  WeeklyActiveAccountsCountId,
  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap,
};
