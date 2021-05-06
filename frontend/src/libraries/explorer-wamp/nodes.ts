import BN from "bn.js";

export interface NodeInfo {
  ipAddress: string;
  accountId: string;
  nodeId: string;
  lastSeen: number;
  lastHeight: number;
  agentName: string;
  agentVersion: string;
  agentBuild: string;
  status: string;
  latitude: number;
  longitude: number;
  city?: string;
}

export interface Validating {
  account_id: string;
  is_slashed?: boolean;
  num_produced_blocks?: number;
  num_expected_blocks?: number;
  public_key: string;
  stake: string;
  new?: boolean;
  removed?: boolean;
  shards?: [number];
  nodeInfo?: NodeInfo;
  fee: { numerator: number; denominator: number };
  delegators?: number;
  cumulativeStakeAmount?: CumulativeStake;
  totalStake?: BN;
}

interface CumulativeStake {
  total: BN;
  networkHolderIndex: number;
}

export interface NodeStats {
  validatorsCount: number;
  onlineNodesCount: number;
  proposalsCount: number;
}
