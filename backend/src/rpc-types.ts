// TODO: get type generation
// https://github.com/Aleph-Alpha/ts-rs
// https://github.com/timfish/bincode-typescript
// schema-rs -> json-schema-to-typescript
// https://crates.io/crates/typescript-type-def
// https://github.com/impero-com/typebinder
// https://github.com/tcr/wasm-typescript-definition

type u8 = number;
type u32 = number;
type u64 = number;
type u128 = string;
type bool = boolean;
type isize = u64 | u32;
type Option<T> = T | undefined;
type String = string;

// https://docs.rs/near-primitives/0.12.0/near_primitives/version/type.ProtocolVersion.html
type ProtocolVersion = u32;

// https://docs.rs/chrono/latest/chrono/offset/struct.Utc.html
type Utc = unknown;

// https://docs.rs/chrono/latest/chrono/struct.DateTime.html
type DateTime<T extends unknown = unknown> = string & T;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.BlockHeight.html
type BlockHeight = u64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.NumSeats.html
type NumSeats = u64;

// https://doc.rust-lang.org/nightly/alloc/vec/struct.Vec.html
type Vec<T> = T[];

// https://docs.rs/num-rational/0.3.2/num_rational/struct.Ratio.html
type Ratio<T> = [T, T];

// https://docs.rs/num-rational/0.3.2/num_rational/type.Rational.html
type Rational = Ratio<isize>;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.EpochHeight.html
type EpochHeight = u64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.BlockHeightDelta.html
type BlockHeightDelta = u64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.Gas.html
type Gas = u64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.Balance.html
type Balance = u128;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.NumBlocks.html
type NumBlocks = u64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/account/id/struct.AccountId.html
type AccountId = string;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.NumShards.html
type NumShards = u64;

// https://docs.rs/near-primitives/0.12.0/src/near_primitives/shard_layout.rs.html#54
type ShardVersion = u32;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.ShardId.html
type ShardId = u64;

// https://docs.rs/near-primitives/0.12.0/src/near_primitives/shard_layout.rs.html#79
type ShardSplitMap = Vec<Vec<ShardId>>;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.StateRoot.html
type StateRoot = CryptoHash;

// https://docs.rs/near-primitives/0.12.0/near_primitives/hash/struct.CryptoHash.html
type CryptoHash = string;

// https://docs.rs/near-crypto-v01/0.1.0/near_crypto_v01/enum.Signature.html
type Signature = string;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.StorageUsage.html
type StorageUsage = u64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.Nonce.html
export type Nonce = u64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.MerkleHash.html
type MerkleHash = CryptoHash;

// https://docs.rs/near-primitives/0.12.0/near_primitives/merkle/enum.Direction.html
type Direction = "Left" | "Right";

// https://docs.rs/near-primitives/0.12.0/near_primitives/merkle/struct.MerklePathItem.html
type MerklePathItem = {
  hash: MerkleHash;
  direction: Direction;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/merkle/type.MerklePath.html
type MerklePath = Vec<MerklePathItem>;

// https://docs.rs/near-primitives/0.12.0/near_primitives/version/struct.Version.html
type Version = {
  version: String;
  build: String;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/fees/struct.DataReceiptCreationConfig.html
type DataReceiptCreationConfig = {
  base_cost: Fee;
  cost_per_byte: Fee;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/challenge/struct.SlashedValidator.html
type SlashedValidator = {
  account_id: AccountId;
  is_double_sign: bool;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/challenge/type.ChallengesResult.html
type ChallengesResult = Vec<SlashedValidator>;

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/fees/struct.ActionCreationConfig.html
type ActionCreationConfig = {
  create_account_cost: Fee;
  deploy_contract_cost: Fee;
  deploy_contract_cost_per_byte: Fee;
  function_call_cost: Fee;
  function_call_cost_per_byte: Fee;
  transfer_cost: Fee;
  stake_cost: Fee;
  add_key_cost: AccessKeyCreationConfig;
  delete_key_cost: Fee;
  delete_account_cost: Fee;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/fees/struct.StorageUsageConfig.html
type StorageUsageConfig = {
  num_bytes_account: u64;
  num_extra_bytes_record: u64;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/fees/struct.RuntimeFeesConfig.html
type RuntimeFeesConfig = {
  action_receipt_creation_config: Fee;
  data_receipt_creation_config: DataReceiptCreationConfig;
  action_creation_config: ActionCreationConfig;
  storage_usage_config: StorageUsageConfig;
  burnt_gas_reward: Ratio<isize>;
  pessimistic_gas_price_inflation_ratio: Ratio<isize>;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/config/struct.ExtCostsConfig.html
type ExtCostsConfig = {
  base: u64;
  contract_compile_base: u64;
  contract_compile_bytes: u64;
  read_memory_base: u64;
  read_memory_byte: u64;
  write_memory_base: u64;
  write_memory_byte: u64;
  read_register_base: u64;
  read_register_byte: u64;
  write_register_base: u64;
  write_register_byte: u64;
  utf8_decoding_base: u64;
  utf8_decoding_byte: u64;
  utf16_decoding_base: u64;
  utf16_decoding_byte: u64;
  sha256_base: u64;
  sha256_byte: u64;
  keccak256_base: u64;
  keccak256_byte: u64;
  keccak512_base: u64;
  keccak512_byte: u64;
  ripemd160_base: u64;
  ripemd160_block: u64;
  ecrecover_base: u64;
  log_base: u64;
  log_byte: u64;
  storage_write_base: u64;
  storage_write_key_byte: u64;
  storage_write_value_byte: u64;
  storage_write_evicted_byte: u64;
  storage_read_base: u64;
  storage_read_key_byte: u64;
  storage_read_value_byte: u64;
  storage_remove_base: u64;
  storage_remove_key_byte: u64;
  storage_remove_ret_value_byte: u64;
  storage_has_key_base: u64;
  storage_has_key_byte: u64;
  storage_iter_create_prefix_base: u64;
  storage_iter_create_prefix_byte: u64;
  storage_iter_create_range_base: u64;
  storage_iter_create_from_byte: u64;
  storage_iter_create_to_byte: u64;
  storage_iter_next_base: u64;
  storage_iter_next_key_byte: u64;
  storage_iter_next_value_byte: u64;
  touching_trie_node: u64;
  promise_and_base: u64;
  promise_and_per_promise: u64;
  promise_return: u64;
  validator_stake_base: u64;
  validator_total_stake_base: u64;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/config/struct.VMLimitConfig.html
type VMLimitConfig = {
  max_gas_burnt: u64;
  max_gas_burnt_view: u64;
  max_stack_height: u32;
  initial_memory_pages: u32;
  max_memory_pages: u32;
  registers_memory_limit: u64;
  max_register_size: u64;
  max_number_registers: u64;
  max_number_logs: u64;
  max_total_log_length: u64;
  max_total_prepaid_gas: u64;
  max_actions_per_receipt: u64;
  max_number_bytes_method_names: u64;
  max_length_method_name: u64;
  max_arguments_length: u64;
  max_length_returned_data: u64;
  max_contract_size: u64;
  max_transaction_size: u64;
  max_length_storage_key: u64;
  max_length_storage_value: u64;
  max_promises_per_function_call_action: u64;
  max_number_input_data_dependencies: u64;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/config/struct.VMConfig.html
type VMConfig = {
  ext_costs: ExtCostsConfig;
  grow_mem_cost: u32;
  regular_op_cost: u32;
  limit_config: VMLimitConfig;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/fees/struct.Fee.html
type Fee = {
  send_sir: u64;
  send_not_sir: u64;
  execution: u64;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/fees/struct.AccessKeyCreationConfig.html
type AccessKeyCreationConfig = {
  full_access_cost: Fee;
  function_call_cost: Fee;
  function_call_cost_per_byte: Fee;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/config/struct.AccountCreationConfig.html
type AccountCreationConfig = {
  min_allowed_top_level_account_length: u8;
  registrar_account_id: AccountId;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/config/struct.RuntimeConfig.html
type RuntimeConfig = {
  storage_amount_per_byte: Balance;
  transaction_costs: RuntimeFeesConfig;
  wasm_config: VMConfig;
  account_creation_config: AccountCreationConfig;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/shard_layout/struct.ShardLayoutV0.html
type ShardLayoutV0 = {
  num_shards: NumShards;
  version: ShardVersion;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/shard_layout/struct.ShardLayoutV1.html
type ShardLayoutV1 = {
  /// num_shards = fixed_shards.len() + boundary_accounts.len() + 1
  /// Each account and all sub-accounts map to the shard of position in this array.
  fixed_shards: Vec<AccountId>;
  /// The rest are divided by boundary_accounts to ranges, each range is mapped to a shard
  boundary_accounts: Vec<AccountId>;
  /// Maps shards from the last shard layout to shards that it splits to in this shard layout,
  /// Useful for constructing states for the shards.
  /// None for the genesis shard layout
  shards_split_map: Option<ShardSplitMap>;
  /// Maps shard in this shard layout to their parent shard
  /// Since shard_ids always range from 0 to num_shards - 1, we use vec instead of a hashmap
  to_parent_shard_map: Option<Vec<ShardId>>;
  /// Version of the shard layout, this is useful for uniquely identify the shard layout
  version: ShardVersion;
};

// https://docs.rs/near-primitives/0.12.0/x86_64-unknown-linux-gnu/near_primitives/shard_layout/enum.ShardLayout.html
type ShardLayout = { V0: ShardLayoutV0 } | { V1: ShardLayoutV1 };

// https://docs.rs/near-crypto/0.12.0/near_crypto/enum.PublicKey.html
export type PublicKey = string;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/struct.AccountInfo.html
type AccountInfo = {
  account_id: AccountId;
  public_key: PublicKey;
  amount: Balance;
};

// https://docs.rs/near-chain-configs/0.12.0/near_chain_configs/struct.GenesisConfig.html
type GenesisConfig = {
  protocol_version: ProtocolVersion;
  genesis_time: DateTime<Utc>;
  chain_id: String;
  genesis_height: BlockHeight;
  num_block_producer_seats: NumSeats;
  num_block_producer_seats_per_shard: Vec<NumSeats>;
  avg_hidden_validator_seats_per_shard: Vec<NumSeats>;
  dynamic_resharding: bool;
  protocol_upgrade_stake_threshold: Rational;
  protocol_upgrade_num_epochs: EpochHeight;
  epoch_length: BlockHeightDelta;
  gas_limit: Gas;
  min_gas_price: Balance;
  max_gas_price: Balance;
  block_producer_kickout_threshold: u8;
  chunk_producer_kickout_threshold: u8;
  online_min_threshold: Rational;
  online_max_threshold: Rational;
  gas_price_adjustment_rate: Rational;
  validators: Vec<AccountInfo>;
  transaction_validity_period: NumBlocks;
  protocol_reward_rate: Rational;
  max_inflation_rate: Rational;
  total_supply: Balance;
  num_blocks_per_year: NumBlocks;
  protocol_treasury_account: AccountId;
  fishermen_threshold: Balance;
  minimum_stake_divisor: u64;
  shard_layout: ShardLayout;
  simple_nightshade_shard_layout: Option<ShardLayout>;
  minimum_stake_ratio: Rational;
};

// https://docs.rs/near-chain-configs/latest/near_chain_configs/struct.ProtocolConfigView.html
type ProtocolConfigView = {
  protocol_version: ProtocolVersion;
  genesis_time: DateTime<Utc>;
  chain_id: String;
  genesis_height: BlockHeight;
  num_block_producer_seats: NumSeats;
  num_block_producer_seats_per_shard: Vec<NumSeats>;
  avg_hidden_validator_seats_per_shard: Vec<NumSeats>;
  dynamic_resharding: bool;
  protocol_upgrade_stake_threshold: Rational;
  epoch_length: BlockHeightDelta;
  gas_limit: Gas;
  min_gas_price: Balance;
  max_gas_price: Balance;
  block_producer_kickout_threshold: u8;
  chunk_producer_kickout_threshold: u8;
  online_min_threshold: Rational;
  online_max_threshold: Rational;
  gas_price_adjustment_rate: Rational;
  runtime_config: RuntimeConfig;
  transaction_validity_period: NumBlocks;
  protocol_reward_rate: Rational;
  max_inflation_rate: Rational;
  num_blocks_per_year: NumBlocks;
  protocol_treasury_account: AccountId;
  fishermen_threshold: Balance;
  minimum_stake_divisor: u64;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.ChunkHeaderView.html
type ChunkHeaderView = {
  chunk_hash: CryptoHash;
  prev_block_hash: CryptoHash;
  outcome_root: CryptoHash;
  prev_state_root: StateRoot;
  encoded_merkle_root: CryptoHash;
  encoded_length: u64;
  height_created: BlockHeight;
  height_included: BlockHeight;
  shard_id: ShardId;
  gas_used: Gas;
  gas_limit: Gas;
  rent_paid: Balance;
  validator_reward: Balance;
  balance_burnt: Balance;
  outgoing_receipts_root: CryptoHash;
  tx_root: CryptoHash;
  validator_proposals: Vec<ValidatorStakeView>;
  signature: Signature;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.BlockHeaderView.html
type BlockHeaderView = {
  height: BlockHeight;
  epoch_id: CryptoHash;
  next_epoch_id: CryptoHash;
  hash: CryptoHash;
  prev_hash: CryptoHash;
  prev_state_root: CryptoHash;
  chunk_receipts_root: CryptoHash;
  chunk_headers_root: CryptoHash;
  chunk_tx_root: CryptoHash;
  outcome_root: CryptoHash;
  chunks_included: u64;
  challenges_root: CryptoHash;
  timestamp: u64;
  // #[serde(with = "u64_dec_format")]
  timestamp_nanosec: string;
  random_value: CryptoHash;
  validator_proposals: Vec<ValidatorStakeView>;
  chunk_mask: Vec<bool>;
  gas_price: Balance;
  rent_paid: Balance;
  validator_reward: Balance;
  total_supply: Balance;
  challenges_result: ChallengesResult;
  last_final_block: CryptoHash;
  last_ds_final_block: CryptoHash;
  next_bp_hash: CryptoHash;
  block_merkle_root: CryptoHash;
  approvals: Vec<Option<Signature>>;
  signature: Signature;
  latest_protocol_version: ProtocolVersion;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.BlockView.html
export type BlockView = {
  author: AccountId;
  header: BlockHeaderView;
  chunks: Vec<ChunkHeaderView>;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.ValidatorStakeViewV1.html
type ValidatorStakeViewV1 = {
  account_id: AccountId;
  public_key: PublicKey;
  stake: Balance;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/validator_stake_view/enum.ValidatorStakeView.html
type ValidatorStakeView = ValidatorStakeViewV1;

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.CurrentEpochValidatorInfo.html
type CurrentEpochValidatorInfo = {
  account_id: AccountId;
  public_key: PublicKey;
  is_slashed: bool;
  stake: Balance;
  shards: Vec<ShardId>;
  num_produced_blocks: NumBlocks;
  num_expected_blocks: NumBlocks;
  num_produced_chunks: NumBlocks;
  num_expected_chunks: NumBlocks;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.NextEpochValidatorInfo.html
type NextEpochValidatorInfo = {
  account_id: AccountId;
  public_key: PublicKey;
  stake: Balance;
  shards: Vec<ShardId>;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/enum.ValidatorKickoutReason.html
type ValidatorKickoutReason =
  | "Slashed"
  | {
      NotEnoughBlocks: {
        produced: NumBlocks;
        expected: NumBlocks;
      };
    }
  | {
      NotEnoughChunks: {
        produced: NumBlocks;
        expected: NumBlocks;
      };
    }
  | { Unstaked: {} }
  | {
      NotEnoughStake: {
        stake: Balance;
        threshold: Balance;
      };
    }
  | { DidNotGetASeat: {} };

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.ValidatorKickoutView.html
type ValidatorKickoutView = {
  account_id: AccountId;
  reason: ValidatorKickoutReason;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.EpochValidatorInfo.html
type EpochValidatorInfo = {
  current_validators: Vec<CurrentEpochValidatorInfo>;
  next_validators: Vec<NextEpochValidatorInfo>;
  current_fishermen: Vec<ValidatorStakeView>;
  next_fishermen: Vec<ValidatorStakeView>;
  current_proposals: Vec<ValidatorStakeView>;
  prev_epoch_kickout: Vec<ValidatorKickoutView>;
  epoch_start_height: BlockHeight;
  epoch_height: EpochHeight;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/enum.QueryResponseKind.html
type QueryResponseKind = {
  ViewAccount: AccountView;
  ViewCode: ContractCodeView;
  ViewState: ViewStateResult;
  CallResult: CallResult;
  AccessKey: AccessKeyView;
  AccessKeyList: AccessKeyList;
};

// https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/query/struct.RpcQueryResponse.html
type RpcQueryResponse = /* [serde(flatten)], [serde(untagged)] */ QueryResponseKind[keyof QueryResponseKind] & {
  block_height: BlockHeight;
  block_hash: CryptoHash;
};

export type RpcQueryRequestTypeMapping = {
  view_account: AccountView;
  view_code: ContractCodeView;
  view_state: ViewStateResult;
  call_function: CallResult;
  view_access_key: AccessKeyView;
  view_access_key_list: AccessKeyList;
};

export type RpcQueryResponseNarrowed<
  K extends keyof RpcQueryRequestTypeMapping
> = Omit<RpcQueryResponse, keyof QueryResponseKind[keyof QueryResponseKind]> &
  RpcQueryRequestTypeMapping[K];

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.ContractCodeView.html
type ContractCodeView = {
  code: Vec<u8>;
  hash: CryptoHash;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/type.TrieProofPath.html
type TrieProofPath = Vec<String>;

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.StateItem.html
type StateItem = {
  key: String;
  value: String;
  proof: TrieProofPath;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.ViewStateResult.html
type ViewStateResult = {
  values: Vec<StateItem>;
  proof: TrieProofPath;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.CallResult.html
type CallResult = {
  result: Vec<u8>;
  logs: Vec<String>;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.AccountView.html
export type AccountView = {
  amount: Balance;
  locked: Balance;
  code_hash: CryptoHash;
  storage_usage: StorageUsage;
  storage_paid_at: BlockHeight;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/enum.AccessKeyPermissionView.html
export type AccessKeyPermissionView =
  | {
      FunctionCall: {
        allowance: Option<Balance>;
        receiver_id: String;
        method_names: Vec<String>;
      };
    }
  | "FullAccess";

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.AccessKeyView.html
export type AccessKeyView = {
  nonce: Nonce;
  permission: AccessKeyPermissionView;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.AccessKeyInfoView.html
type AccessKeyInfoView = {
  public_key: PublicKey;
  access_key: AccessKeyView;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.AccessKeyList.html
export type AccessKeyList = {
  keys: Vec<AccessKeyInfoView>;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.ValidatorInfo.html
type ValidatorInfo = {
  account_id: AccountId;
  is_slashed: bool;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.StatusSyncInfo.html
type StatusSyncInfo = {
  latest_block_hash: CryptoHash;
  latest_block_height: BlockHeight;
  latest_state_root: CryptoHash;
  latest_block_time: DateTime<Utc>;
  syncing: bool;
  earliest_block_hash: Option<CryptoHash>;
  earliest_block_height: Option<BlockHeight>;
  earliest_block_time: Option<DateTime<Utc>>;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.StatusResponse.html
export type StatusResponse = {
  version: Version;
  chain_id: String;
  protocol_version: u32;
  latest_protocol_version: u32;
  rpc_addr: Option<String>;
  validators: Vec<ValidatorInfo>;
  sync_info: StatusSyncInfo;
  validator_account_id: Option<AccountId>;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/enum.FinalExecutionStatus.html
// The unknown types may be wrong!
export type FinalExecutionStatus =
  | { NotStarted: unknown }
  | { Started: unknown }
  | { Failure: unknown }
  | { SuccessValue: String };

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.SignedTransactionView.html
type SignedTransactionView = {
  signer_id: AccountId;
  public_key: PublicKey;
  nonce: Nonce;
  receiver_id: AccountId;
  actions: Vec<ActionView>;
  signature: Signature;
  hash: CryptoHash;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/enum.ExecutionStatusView.html
// The unknown types may be wrong!
export type ExecutionStatusView =
  | { Unknown: unknown }
  | { Failure: unknown }
  | { SuccessValue: String }
  | { SuccessReceiptId: CryptoHash };

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.CostGasUsed.html
type CostGasUsed = {
  cost_category: String;
  cost: String;
  gas_used: Gas;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.ExecutionMetadataView.html
type ExecutionMetadataView = {
  version: u32;
  gas_profile: Option<Vec<CostGasUsed>>;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.ExecutionOutcomeView.html
export type ExecutionOutcomeView = {
  logs: Vec<String>;
  receipt_ids: Vec<CryptoHash>;
  gas_burnt: Gas;
  tokens_burnt: Balance;
  executor_id: AccountId;
  status: ExecutionStatusView;
  metadata: ExecutionMetadataView;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.ExecutionOutcomeWithIdView.html
export type ExecutionOutcomeWithIdView = {
  proof: MerklePath;
  block_hash: CryptoHash;
  id: CryptoHash;
  outcome: ExecutionOutcomeView;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.FinalExecutionOutcomeView.html
export type FinalExecutionOutcomeView = {
  status: FinalExecutionStatus;
  transaction: SignedTransactionView;
  transaction_outcome: ExecutionOutcomeWithIdView;
  receipts_outcome: Vec<ExecutionOutcomeWithIdView>;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/enum.ActionView.html
export type DeployContractActionView = {
  DeployContract: {
    code: String;
  };
};
export type FunctionCallActionView = {
  FunctionCall: {
    method_name: String;
    args: String;
    gas: Gas;
    deposit: Balance;
  };
};
export type TransferActionView = {
  Transfer: {
    deposit: Balance;
  };
};
export type StakeActionView = {
  Stake: {
    stake: Balance;
    public_key: PublicKey;
  };
};
export type AddKeyActionView = {
  AddKey: {
    public_key: PublicKey;
    access_key: AccessKeyView;
  };
};
export type DeleteKeyActionView = {
  DeleteKey: {
    public_key: PublicKey;
  };
};
export type DeleteAccountActionView = {
  DeleteAccount: {
    beneficiary_id: AccountId;
  };
};
export type ActionView =
  | "CreateAccount"
  | DeployContractActionView
  | FunctionCallActionView
  | TransferActionView
  | StakeActionView
  | AddKeyActionView
  | DeleteKeyActionView
  | DeleteAccountActionView;

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.DataReceiverView.html
type DataReceiverView = {
  data_id: CryptoHash;
  receiver_id: AccountId;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/enum.ReceiptEnumView.html
type ReceiptEnumView =
  | {
      Action: {
        signer_id: AccountId;
        signer_public_key: PublicKey;
        gas_price: Balance;
        output_data_receivers: Vec<DataReceiverView>;
        input_data_ids: Vec<CryptoHash>;
        actions: Vec<ActionView>;
      };
    }
  | {
      Data: {
        data_id: CryptoHash;
        data: Option<Vec<u8>>;
      };
    };

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.ReceiptView.html
export type ReceiptView = {
  predecessor_id: AccountId;
  receiver_id: AccountId;
  receipt_id: CryptoHash;
  receipt: ReceiptEnumView;
};

// https://docs.rs/near-primitives/latest/near_primitives/views/struct.FinalExecutionOutcomeWithReceiptView.html
export type FinalExecutionOutcomeWithReceiptView = /* [serde(flatten)] */ FinalExecutionOutcomeView & {
  receipts: Vec<ReceiptView>;
};

export type RpcResponseMapping = {
  EXPERIMENTAL_broadcast_tx_sync: unknown;
  EXPERIMENTAL_changes: unknown;
  EXPERIMENTAL_changes_in_block: unknown;
  EXPERIMENTAL_check_tx: unknown;
  // https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/EXPERIMENTAL_genesis_config/type.RpcGenesisConfigResponse.html
  EXPERIMENTAL_genesis_config: GenesisConfig;
  // https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/EXPERIMENTAL_protocol_config/type.RpcProtocolConfigResponse.html
  EXPERIMENTAL_protocol_config: ProtocolConfigView;
  EXPERIMENTAL_receipt: unknown;
  // https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/EXPERIMENTAL_tx_status/type.RpcTransactionStatusResponse.html
  EXPERIMENTAL_tx_status: FinalExecutionOutcomeWithReceiptView;
  EXPERIMENTAL_validators_ordered: unknown;
  // https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/block/type.RpcBlockResponse.html
  block: BlockView;
  broadcast_tx_async: unknown;
  broadcast_tx_commit: unknown;
  chunk: unknown;
  gas_price: unknown;
  health: unknown;
  light_client_proof: unknown;
  network_info: unknown;
  next_light_client_block: unknown;
  // https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/query/struct.RpcQueryResponse.html
  query: RpcQueryResponse;
  // https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/status/type.RpcStatusResponse.html
  status: StatusResponse;
  tx: unknown;
  // https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/validators/type.RpcValidatorResponse.html
  validators: EpochValidatorInfo;
};
