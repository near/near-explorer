import BN from "bn.js";
import { ValidationNodeInfo } from "../../../libraries/wamp/types";

export const VALIDATORS_LIST: ValidationNodeInfo[] = [
  {
    account_id: "staked.poolv1.near",
    is_slashed: false,
    progress: {
      blocks: {
        produced: 1257,
        total: 1257,
      },
      chunks: {
        produced: 0,
        total: 4,
      },
    },
    public_key: "ed25519:3JBVXqenru2ErAM1kHQ8qfd29dCkURLd6JKrFgtmcDTZ",
    shards: [0],
    stakingStatus: "active",
    currentStake: "42476926077593266003727024545752",
    proposedStake: "42585554199314238406961230826241",
    nodeInfo: {
      ipAddress: "44.226.195.207",
      nodeId: "ed25519:Gz76mL1D77d1nDZQi1jZM6WwdH8QEAHt3sor2khaFQLs",
      lastSeen: 1622326196323,
      lastHeight: 38639991,
      status: "NoSync",
      agentName: "near-rs",
      agentVersion: "1.19.1",
      agentBuild: "add9c96b",
      latitude: "45.8491",
      longitude: "-119.7143",
      city: "Boardman",
    },
    fee: {
      numerator: 10,
      denominator: 100,
    },
    delegatorsCount: 874,
    cumulativeStakeAmount: "42476926077593266003727024545752",
  },
  // 'active' without poolDetails
  {
    account_id: "bisontrails.poolv1.near",
    is_slashed: false,
    progress: {
      blocks: {
        produced: 630,
        total: 630,
      },
      chunks: {
        produced: 2,
        total: 6,
      },
    },
    public_key: "ed25519:Emk6wQJtpQZRJCvvPmmwP9GD2Pk37xxRpmb5uRvJpX62",
    shards: [0],
    stakingStatus: "active",
    currentStake: "20814924218405478221870785686346",
    proposedStake: "20816469293003621239852045782324",
    nodeInfo: {
      ipAddress: "34.222.123.106",
      nodeId: "ed25519:2VaBhZM54NukrPenMcCLwmitaKZaSPnyEhqr7mKjDvPj",
      lastSeen: 1622326199959,
      lastHeight: 38639995,
      status: "NoSync",
      agentName: "near-rs",
      agentVersion: "1.19.1",
      agentBuild: "add9c96b",
      latitude: "45.8491",
      longitude: "-119.7143",
      city: "Boardman",
    },
    fee: {
      numerator: 10,
      denominator: 100,
    },
    delegatorsCount: 436,
    cumulativeStakeAmount: "63291850295998744225597810232098",
  },
  // 'active' with all data
  {
    account_id: "astro-stakers.poolv1.near",
    is_slashed: false,
    progress: {
      blocks: {
        produced: 525,
        total: 525,
      },
      chunks: {
        produced: 0,
        total: 10,
      },
    },
    public_key: "ed25519:2nPSBCzjqikgwrqUMcuEVReJhmkC91eqJGPGqH9sZc28",
    shards: [0],
    stakingStatus: "active",
    currentStake: "17776328380244893436869022330562",
    proposedStake: "17777040818619949427934165446355",
    nodeInfo: {
      ipAddress: "145.239.1.147",
      nodeId: "ed25519:FrbiAcqoV4ZrGXaSgf2faXgT6BSa3jRG1NWYvns8Kyho",
      lastSeen: 1622326192345,
      lastHeight: 38639987,
      status: "NoSync",
      agentName: "near-rs",
      agentVersion: "1.19.1",
      agentBuild: "add9c96b",
      latitude: "51.2993",
      longitude: "9.491",
      city: "",
    },
    fee: {
      numerator: 1,
      denominator: 100,
    },
    delegatorsCount: 1774,
    poolDetails: {
      twitter: "@astrostakers",
      url: "astrostakers.com",
      email: "heyheyhey@astrostakers.com",
      description:
        "1% fee in perpetuity secured for NEAR community. Run by Silicon Valley engineers for service permanent availability. We drop rhymes, not blocks",
      country_code: "AQ",
    },
    cumulativeStakeAmount: "99683626384055340095613466402170",
  },
  // joining
  {
    account_id: "baziliknear.poolv1.near",
    public_key: "ed25519:E4LAWdgLifBEoaWvhRNy5vpdAnUc3GsUHePeiAurZY5v",
    shards: [0],
    stakingStatus: "joining",
    currentStake: "3735553291238507324807526403326",
    proposedStake: "3736122287791333873791529790832",
    nodeInfo: {
      ipAddress: "135.181.24.210",
      nodeId: "ed25519:6HBtiS73NrRUCrnKHLzParNBraGaT2NQRX5o51FYaVH9",
      lastSeen: 1622510992841,
      lastHeight: 38825448,
      status: "NoSync",
      agentName: "near-rs",
      agentVersion: "1.19.1",
      agentBuild: "unknown",
      latitude: "43.6319",
      longitude: "-79.3716",
      city: "",
    },
    fee: {
      numerator: 3,
      denominator: 100,
    },
    delegatorsCount: 148,
    poolDetails: {
      email: "baziliknear@gmail.com",
      description: "pool commission 0% until 01.01.2021, then 1%",
      twitter: "etherscaam",
    },
  },
  // proposal
  {
    account_id: "cryptium.poolv1.near",
    public_key: "ed25519:5Y9hW8cKBb5RnsJBqttHHC5ujz5zcZZ5xnrJPwkCWmGQ",
    currentStake: "",
    proposedStake: "2656963060607021394774204108064",
    stakingStatus: "proposal",
    nodeInfo: {
      ipAddress: "135.181.179.176",
      nodeId: "ed25519:268mmTfy4oteCbzBY4HusxYZtDZaWdQaiM5HtTbQmtY5",
      lastSeen: 1622326217984,
      lastHeight: 38640013,
      status: "NoSync",
      agentName: "near-rs",
      agentVersion: "1.19.1",
      agentBuild: "add9c96b",
      latitude: "43.6319",
      longitude: "-79.3716",
      city: "",
    },
    fee: {
      numerator: 5,
      denominator: 100,
    },
    delegatorsCount: 129,
    poolDetails: {
      country_code: "CH",
      description: "Secure and available validation from the Swiss Alps!",
      email: "hello@cryptium.ch",
      twitter: "CryptiumLabs",
      url: "https://cryptium.ch/",
    },
  },
  // newcomer
  {
    account_id: "huobipool.poolv1.near",
    fee: {
      numerator: 10,
      denominator: 100,
    },
    delegatorsCount: 10,
    currentStake: "1200162400050342684350218962960",
    stakingStatus: "newcomer",
  },
  // idle
  {
    account_id: "ashert.poolv1.near",
    nodeInfo: {
      ipAddress: "34.219.20.147",
      nodeId: "ed25519:5tFfDk4r5mbBtxjY1x2v4XcFnbcW6Lm8AuJvzbhcyCBS",
      lastSeen: 1622326216916,
      lastHeight: 38640012,
      status: "NoSync",
      agentName: "near-rs",
      agentVersion: "1.19.1",
      agentBuild: "add9c96b",
      latitude: "45.8491",
      longitude: "-119.7143",
      city: "Boardman",
    },
    fee: {
      numerator: 7,
      denominator: 100,
    },
    delegatorsCount: 9,
    currentStake: "442471954465888931932802773752",
    stakingStatus: "idle",
  },
  // idle with minimum data
  {
    account_id: "sphere.poolv1.near",
    fee: {
      numerator: 8,
      denominator: 100,
    },
    delegatorsCount: 1,
    currentStake: "50000867090131772400000000",
    stakingStatus: "idle",
  },
  // leaving
  {
    account_id: "01node.poolv1.near",
    is_slashed: false,
    progress: {
      blocks: {
        produced: 105,
        total: 105,
      },
      chunks: {
        produced: 1,
        total: 3,
      },
    },
    public_key: "ed25519:5xz7EbcnPqabwoFezdJBxieK8S7XLsdHHuLwM4vLLhFt",
    shards: [0],
    stakingStatus: "leaving",
    currentStake: "3632096312066963778697815591239",
    proposedStake: "3628588479796309298011827055582",
    nodeInfo: {
      ipAddress: "91.207.102.230",
      nodeId: "ed25519:Bjy4baS4MQM7FEQS4YS73boS4hJ6sdEgrfZCjqS5SXoo",
      lastSeen: 1622326197935,
      lastHeight: 38639993,
      status: "NoSync",
      agentName: "near-rs",
      agentVersion: "1.19.1",
      agentBuild: "add9c96b",
      latitude: "46",
      longitude: "25",
      city: "",
    },
    fee: {
      numerator: 1,
      denominator: 100,
    },
    delegatorsCount: 512,
    poolDetails: {
      country_code: "ro",
      email: "hello@01node.com",
      description:
        "01node Professional Staking Services for Near, Skale, Solana, Cosmos, Iris",
      twitter: "@01node",
      url: "https://01node.com/",
    },
    cumulativeStakeAmount: "406947111873428286547337892954837",
  },
];

export const VALIDATORS_TOTAL_STAKE = VALIDATORS_LIST.filter(
  (i: ValidationNodeInfo) =>
    i.stakingStatus && ["active", "leaving"].indexOf(i.stakingStatus) >= 0
).reduce(
  (acc: BN, node: ValidationNodeInfo) => acc.add(new BN(node.currentStake!)),
  new BN(0)
) as BN;
