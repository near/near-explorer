// TODO: get type generation
// https://github.com/Aleph-Alpha/ts-rs
// https://github.com/timfish/bincode-typescript
// schema-rs -> json-schema-to-typescript
// https://crates.io/crates/typescript-type-def
// https://github.com/impero-com/typebinder
// https://github.com/tcr/wasm-typescript-definition

type U8 = number;
type U32 = number;
type U64 = number;
type U128 = string;
type Bool = boolean;
type Isize = U64 | U32;
type Usize = U64 | U32;
type Option<T> = T | null;
type String = string;

// https://docs.rs/near-primitives/0.12.0/near_primitives/version/type.ProtocolVersion.html
type ProtocolVersion = U32;

// https://docs.rs/chrono/latest/chrono/offset/struct.Utc.html
type Utc = unknown;

// https://docs.rs/chrono/latest/chrono/struct.DateTime.html
type DateTime<T extends unknown = unknown> = string & T;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.BlockHeight.html
type BlockHeight = U64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.NumSeats.html
type NumSeats = U64;

// https://doc.rust-lang.org/nightly/alloc/vec/struct.Vec.html
type Vec<T> = T[];

// https://docs.rs/num-rational/0.3.2/num_rational/struct.Ratio.html
type Ratio<T> = [T, T];

// https://docs.rs/num-rational/0.3.2/num_rational/type.Rational.html
type Rational = Ratio<Isize>;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.EpochHeight.html
type EpochHeight = U64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.BlockHeightDelta.html
type BlockHeightDelta = U64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.Gas.html
type Gas = U64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.Balance.html
type Balance = U128;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.NumBlocks.html
type NumBlocks = U64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/account/id/struct.AccountId.html
type AccountId = string;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.NumShards.html
type NumShards = U64;

// https://docs.rs/near-primitives/0.12.0/src/near_primitives/shard_layout.rs.html#54
type ShardVersion = U32;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.ShardId.html
type ShardId = U64;

// https://docs.rs/near-primitives/0.12.0/src/near_primitives/shard_layout.rs.html#79
type ShardSplitMap = Vec<Vec<ShardId>>;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.StateRoot.html
type StateRoot = CryptoHash;

// https://docs.rs/near-primitives/0.12.0/near_primitives/hash/struct.CryptoHash.html
type CryptoHash = string;

// https://docs.rs/near-crypto-v01/0.1.0/near_crypto_v01/enum.Signature.html
type Signature = string;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.StorageUsage.html
type StorageUsage = U64;

// https://docs.rs/near-primitives/0.12.0/near_primitives/types/type.Nonce.html
export type Nonce = U64;

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
  is_double_sign: Bool;
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
  num_bytes_account: U64;
  num_extra_bytes_record: U64;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/fees/struct.RuntimeFeesConfig.html
type RuntimeFeesConfig = {
  action_receipt_creation_config: Fee;
  data_receipt_creation_config: DataReceiptCreationConfig;
  action_creation_config: ActionCreationConfig;
  storage_usage_config: StorageUsageConfig;
  burnt_gas_reward: Ratio<Isize>;
  pessimistic_gas_price_inflation_ratio: Ratio<Isize>;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/config/struct.ExtCostsConfig.html
type ExtCostsConfig = {
  base: U64;
  contract_compile_base: U64;
  contract_compile_bytes: U64;
  read_memory_base: U64;
  read_memory_byte: U64;
  write_memory_base: U64;
  write_memory_byte: U64;
  read_register_base: U64;
  read_register_byte: U64;
  write_register_base: U64;
  write_register_byte: U64;
  utf8_decoding_base: U64;
  utf8_decoding_byte: U64;
  utf16_decoding_base: U64;
  utf16_decoding_byte: U64;
  sha256_base: U64;
  sha256_byte: U64;
  keccak256_base: U64;
  keccak256_byte: U64;
  keccak512_base: U64;
  keccak512_byte: U64;
  ripemd160_base: U64;
  ripemd160_block: U64;
  ecrecover_base: U64;
  log_base: U64;
  log_byte: U64;
  storage_write_base: U64;
  storage_write_key_byte: U64;
  storage_write_value_byte: U64;
  storage_write_evicted_byte: U64;
  storage_read_base: U64;
  storage_read_key_byte: U64;
  storage_read_value_byte: U64;
  storage_remove_base: U64;
  storage_remove_key_byte: U64;
  storage_remove_ret_value_byte: U64;
  storage_has_key_base: U64;
  storage_has_key_byte: U64;
  storage_iter_create_prefix_base: U64;
  storage_iter_create_prefix_byte: U64;
  storage_iter_create_range_base: U64;
  storage_iter_create_from_byte: U64;
  storage_iter_create_to_byte: U64;
  storage_iter_next_base: U64;
  storage_iter_next_key_byte: U64;
  storage_iter_next_value_byte: U64;
  touching_trie_node: U64;
  promise_and_base: U64;
  promise_and_per_promise: U64;
  promise_return: U64;
  validator_stake_base: U64;
  validator_total_stake_base: U64;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/config/struct.VMLimitConfig.html
type VMLimitConfig = {
  max_gas_burnt: U64;
  max_gas_burnt_view: U64;
  max_stack_height: U32;
  initial_memory_pages: U32;
  max_memory_pages: U32;
  registers_memory_limit: U64;
  max_register_size: U64;
  max_number_registers: U64;
  max_number_logs: U64;
  max_total_log_length: U64;
  max_total_prepaid_gas: U64;
  max_actions_per_receipt: U64;
  max_number_bytes_method_names: U64;
  max_length_method_name: U64;
  max_arguments_length: U64;
  max_length_returned_data: U64;
  max_contract_size: U64;
  max_transaction_size: U64;
  max_length_storage_key: U64;
  max_length_storage_value: U64;
  max_promises_per_function_call_action: U64;
  max_number_input_data_dependencies: U64;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/config/struct.VMConfig.html
type VMConfig = {
  ext_costs: ExtCostsConfig;
  grow_mem_cost: U32;
  regular_op_cost: U32;
  limit_config: VMLimitConfig;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/fees/struct.Fee.html
type Fee = {
  send_sir: U64;
  send_not_sir: U64;
  execution: U64;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/fees/struct.AccessKeyCreationConfig.html
type AccessKeyCreationConfig = {
  full_access_cost: Fee;
  function_call_cost: Fee;
  function_call_cost_per_byte: Fee;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/runtime/config/struct.AccountCreationConfig.html
type AccountCreationConfig = {
  min_allowed_top_level_account_length: U8;
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
  dynamic_resharding: Bool;
  protocol_upgrade_stake_threshold: Rational;
  protocol_upgrade_num_epochs: EpochHeight;
  epoch_length: BlockHeightDelta;
  gas_limit: Gas;
  min_gas_price: Balance;
  max_gas_price: Balance;
  block_producer_kickout_threshold: U8;
  chunk_producer_kickout_threshold: U8;
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
  minimum_stake_divisor: U64;
  shard_layout: ShardLayout;
  simple_nightshade_shard_layout: Option<ShardLayout>;
  minimum_stake_ratio: Rational;
};

// https://docs.rs/near-chain-configs/latest/near_chain_configs/struct.ProtocolConfigView.html
export type ProtocolConfigView = {
  protocol_version: ProtocolVersion;
  genesis_time: DateTime<Utc>;
  chain_id: String;
  genesis_height: BlockHeight;
  num_block_producer_seats: NumSeats;
  num_block_producer_seats_per_shard: Vec<NumSeats>;
  avg_hidden_validator_seats_per_shard: Vec<NumSeats>;
  dynamic_resharding: Bool;
  protocol_upgrade_stake_threshold: Rational;
  epoch_length: BlockHeightDelta;
  gas_limit: Gas;
  min_gas_price: Balance;
  max_gas_price: Balance;
  block_producer_kickout_threshold: U8;
  chunk_producer_kickout_threshold: U8;
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
  minimum_stake_divisor: U64;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.ChunkHeaderView.html
type ChunkHeaderView = {
  chunk_hash: CryptoHash;
  prev_block_hash: CryptoHash;
  outcome_root: CryptoHash;
  prev_state_root: StateRoot;
  encoded_merkle_root: CryptoHash;
  encoded_length: U64;
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
  chunks_included: U64;
  challenges_root: CryptoHash;
  timestamp: U64;
  // #[serde(with = "u64_dec_format")]
  timestamp_nanosec: string;
  random_value: CryptoHash;
  validator_proposals: Vec<ValidatorStakeView>;
  chunk_mask: Vec<Bool>;
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
export type ValidatorStakeView = ValidatorStakeViewV1;

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.CurrentEpochValidatorInfo.html
export type CurrentEpochValidatorInfo = {
  account_id: AccountId;
  public_key: PublicKey;
  is_slashed: Bool;
  stake: Balance;
  shards: Vec<ShardId>;
  num_produced_blocks: NumBlocks;
  num_expected_blocks: NumBlocks;
  num_produced_chunks: NumBlocks;
  num_expected_chunks: NumBlocks;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.NextEpochValidatorInfo.html
export type NextEpochValidatorInfo = {
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
export type EpochValidatorInfo = {
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
type RpcQueryResponse =
  /* [serde(flatten)], [serde(untagged)] */ QueryResponseKind[keyof QueryResponseKind] & {
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
  code: Vec<U8>;
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
  result: Vec<U8>;
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
  is_slashed: Bool;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.StatusSyncInfo.html
type StatusSyncInfo = {
  latest_block_hash: CryptoHash;
  latest_block_height: BlockHeight;
  latest_state_root: CryptoHash;
  latest_block_time: DateTime<Utc>;
  syncing: Bool;
  earliest_block_hash: Option<CryptoHash>;
  earliest_block_height: Option<BlockHeight>;
  earliest_block_time: Option<DateTime<Utc>>;
};

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/struct.StatusResponse.html
export type StatusResponse = {
  version: Version;
  chain_id: String;
  protocol_version: U32;
  latest_protocol_version: U32;
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
export type SignedTransactionView = {
  signer_id: AccountId;
  public_key: PublicKey;
  nonce: Nonce;
  receiver_id: AccountId;
  actions: Vec<ActionView>;
  signature: Signature;
  hash: CryptoHash;
};

// The unknown types may be wrong!
export type CompilationError =
  | { CodeDoesNotExist: { account_id: AccountId } }
  // https://docs.rs/near-vm-errors/0.12.0/near_vm_errors/enum.PrepareError.html
  | { PrepareError: unknown }
  | { WasmerCompileError: { msg: String } }
  | { UnsupportedCompiler: { msg: String } };
export type FunctionCallError =
  | { CompilationError: CompilationError }
  | { LinkError: { msg: String } }
  // https://docs.rs/near-vm-errors/0.12.0/near_vm_errors/enum.MethodResolveError.html
  | { MethodResolveError: unknown }
  // https://docs.rs/near-vm-errors/0.12.0/near_vm_errors/enum.WasmTrap.html
  | { WasmTrap: unknown }
  // https://docs.rs/near-vm-errors/0.12.0/near_vm_errors/enum.FunctionCallErrorSer.html#variant.WasmUnknownError
  | { WasmUnknownError: unknown }
  // https://docs.rs/near-vm-errors/0.12.0/near_vm_errors/enum.HostError.html
  | { HostError: unknown }
  | { _EVMError: unknown }
  | { ExecutionError: String };

// https://docs.rs/near-primitives/0.12.0/near_primitives/errors/enum.ActionsValidationError.html
type ActionsValidation = unknown;
export type NewReceiptValidationError =
  | { InvalidPredecessorId: { account_id: String } }
  | { InvalidReceiverId: { account_id: String } }
  | { InvalidSignerId: { account_id: String } }
  | { InvalidDataReceiverId: { account_id: String } }
  | { ReturnedValueLengthExceeded: { length: U64; limit: U64 } }
  | {
      NumberInputDataDependenciesExceeded: {
        number_of_input_data_dependencies: U64;
        limit: U64;
      };
    }
  | { ActionsValidation: ActionsValidation };

// https://docs.rs/near-primitives/0.16.0/near_primitives/errors/enum.InvalidAccessKeyError.html
export type InvalidAccessKeyError =
  | {
      AccessKeyNotFound: {
        account_id: AccountId;
        public_key: PublicKey;
      };
    }
  | {
      ReceiverMismatch: {
        tx_receiver: AccountId;
        ak_receiver: String;
      };
    }
  | {
      MethodNameMismatch: {
        method_name: String;
      };
    }
  | "RequiresFullAccess"
  | {
      NotEnoughAllowance: {
        account_id: AccountId;
        public_key: PublicKey;
        allowance: Balance;
        cost: Balance;
      };
    }
  | "DepositWithFunctionCall";

type ActionErrorKind =
  | { AccountAlreadyExists: { account_id: AccountId } }
  | { AccountDoesNotExist: { account_id: AccountId } }
  | {
      CreateAccountOnlyByRegistrar: {
        account_id: AccountId;
        registrar_account_id: AccountId;
        predecessor_id: AccountId;
      };
    }
  | {
      CreateAccountNotAllowed: {
        account_id: AccountId;
        predecessor_id: AccountId;
      };
    }
  | { ActorNoPermission: { account_id: AccountId; actor_id: AccountId } }
  | { DeleteKeyDoesNotExist: { account_id: AccountId; public_key: PublicKey } }
  | { AddKeyAlreadyExists: { account_id: AccountId; public_key: PublicKey } }
  | { DeleteAccountStaking: { account_id: AccountId } }
  | { LackBalanceForState: { account_id: AccountId; amount: Balance } }
  | { TriesToUnstake: { account_id: AccountId } }
  | {
      TriesToStake: {
        account_id: AccountId;
        stake: Balance;
        locked: Balance;
        balance: Balance;
      };
    }
  | {
      InsufficientStake: {
        account_id: AccountId;
        stake: Balance;
        minimum_stake: Balance;
      };
    }
  | { FunctionCallError: FunctionCallError }
  | { NewReceiptValidationError: NewReceiptValidationError }
  | { OnlyImplicitAccountCreationAllowed: { account_id: AccountId } }
  | { DeleteAccountWithLargeState: { account_id: AccountId } }
  | "DelegateActionInvalidSignature"
  | {
      DelegateActionSenderDoesNotMatchTxReceiver: {
        sender_id: AccountId;
        receiver_id: AccountId;
      };
    }
  | "DelegateActionExpired"
  | { DelegateActionAccessKeyError: InvalidAccessKeyError }
  | { DelegateActionInvalidNonce: { delegate_nonce: Nonce; ak_nonce: Nonce } }
  | {
      DelegateActionNonceTooLarge: {
        delegate_nonce: Nonce;
        upper_bound: Nonce;
      };
    };

export type ActionError = {
  index: U64;
  kind: ActionErrorKind;
};

export type InvalidTxError =
  | { InvalidAccessKeyError: InvalidAccessKeyError }
  | { InvalidSignerId: { signer_id: String } }
  | { SignerDoesNotExist: { signer_id: AccountId } }
  | { InvalidNonce: { tx_nonce: Nonce; ak_nonce: Nonce } }
  | { NonceTooLarge: { tx_nonce: Nonce; upper_bound: Nonce } }
  | { InvalidReceiverId: { receiver_id: String } }
  // https://docs.rs/near-primitives/0.12.0/near_primitives/errors/enum.InvalidTxError.html#variant.InvalidSignature
  | { InvalidSignature: unknown }
  | {
      NotEnoughBalance: {
        signer_id: AccountId;
        balance: Balance;
        cost: Balance;
      };
    }
  | { LackBalanceForState: { signer_id: AccountId; amount: Balance } }
  | { CostOverflow: unknown }
  | { InvalidChain: unknown }
  | { Expired: unknown }
  // https://docs.rs/near-primitives/0.12.0/near_primitives/errors/enum.ActionsValidationError.html
  | { ActionsValidation: unknown }
  | { TransactionSizeExceeded: { size: U64; limit: U64 } };

export type TxExecutionError =
  | { ActionError: ActionError }
  | { InvalidTxError: InvalidTxError };

// https://docs.rs/near-primitives/0.12.0/near_primitives/views/enum.ExecutionStatusView.html
export type ExecutionStatusView =
  | { Unknown: unknown }
  | { Failure: TxExecutionError }
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
  version: U32;
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

// https://docs.rs/near-primitives/0.16.0/near_primitives/delegate_action/struct.NonDelegateAction.html
export type NonDelegateActionView = Exclude<ActionView, DelegateActionView>;

// https://docs.rs/near-primitives/0.16.0/near_primitives/delegate_action/struct.DelegateAction.html
export type DelegateAction = {
  sender_id: AccountId;
  receiver_id: AccountId;
  actions: Vec<NonDelegateActionView>;
  nonce: Nonce;
  max_block_height: BlockHeight;
  public_key: PublicKey;
};

// https://docs.rs/near-primitives/0.16.0/near_primitives/views/enum.ActionView.html
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
export type DelegateActionView = {
  Delegate: {
    delegate_action: DelegateAction;
    signature: Signature;
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
  | DeleteAccountActionView
  | DelegateActionView;

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
        data: Option<Vec<U8>>;
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
export type FinalExecutionOutcomeWithReceiptView =
  /* [serde(flatten)] */ FinalExecutionOutcomeView & {
    receipts: Vec<ReceiptView>;
  };

// https://docs.rs/near-primitives/0.12.0/near_primitives/network/struct.PeerId.html
type PeerId = PublicKey;

// https://doc.rust-lang.org/nightly/std/net/enum.SocketAddr.html
type SocketAddr = string;

// https://docs.rs/near-jsonrpc-primitives/0.12.0/near_jsonrpc_primitives/types/network_info/struct.RpcPeerInfo.html
type RpcPeerInfo = {
  id: PeerId;
  addr: Option<SocketAddr>;
  account_id: Option<AccountId>;
};

// https://docs.rs/near-jsonrpc-primitives/0.12.0/near_jsonrpc_primitives/types/network_info/struct.RpcKnownProducer.html
type RpcKnownProducer = {
  account_id: AccountId;
  addr: Option<SocketAddr>;
  peer_id: PeerId;
};

// https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/network_info/struct.RpcNetworkInfoResponse.html
export type RpcNetworkInfoResponse = {
  active_peers: Vec<RpcPeerInfo>;
  num_active_peers: Usize;
  peer_max_count: U32;
  sent_bytes_per_sec: U64;
  received_bytes_per_sec: U64;
  /// Accounts of known block and chunk producers from routing table.
  known_producers: Vec<RpcKnownProducer>;
};

export type ResponseMapping = {
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
  // https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/network_info/struct.RpcNetworkInfoResponse.html
  network_info: RpcNetworkInfoResponse;
  next_light_client_block: unknown;
  // https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/query/struct.RpcQueryResponse.html
  query: RpcQueryResponse;
  // https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/status/type.RpcStatusResponse.html
  status: StatusResponse;
  tx: unknown;
  // https://docs.rs/near-jsonrpc-client/latest/near_jsonrpc_client/methods/validators/type.RpcValidatorResponse.html
  validators: EpochValidatorInfo;
};
