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
  accountId: string;
  isSlashed?: boolean;
  numProducedBlocks?: number;
  numExpectedBlocks?: number;
  publicKey: string;
  stake: string;
  new?: boolean;
  removed?: boolean;
  shards: [number];
  nodeInfo?: NodeInfo;
}

export interface NodeStats {
  validatorsCount: number;
  onlineNodesCount: number;
  proposalsCount: number;
}

export interface Proposal {
  accountId: string;
  publicKey: string;
  stake: string;
}
