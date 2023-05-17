import { ValidatorFullData } from "@explorer/common/types/procedures";

export const VALIDATORS_LIST: ValidatorFullData[] = [
  {
    accountId: "staked.poolv1.near",
    publicKey: "ed25519:3JBVXqenru2ErAM1kHQ8qfd29dCkURLd6JKrFgtmcDTZ",
    currentEpoch: {
      stake: "42476926077593266003727024545752",
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
    },
    nextEpoch: {
      stake: "42585554199314238406961230826241",
    },
    poolInfo: {
      fee: {
        numerator: 10,
        denominator: 100,
      },
      delegatorsCount: 874,
    },
    telemetry: {
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
  },
  // 'active' without description
  {
    accountId: "bisontrails.poolv1.near",
    publicKey: "ed25519:Emk6wQJtpQZRJCvvPmmwP9GD2Pk37xxRpmb5uRvJpX62",
    currentEpoch: {
      stake: "20814924218405478221870785686346",
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
    },
    nextEpoch: {
      stake: "20816469293003621239852045782324",
    },
    poolInfo: {
      fee: {
        numerator: 10,
        denominator: 100,
      },
      delegatorsCount: 436,
    },
    telemetry: {
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
  },
  // 'active' with all data
  {
    accountId: "astro-stakers.poolv1.near",
    publicKey: "ed25519:2nPSBCzjqikgwrqUMcuEVReJhmkC91eqJGPGqH9sZc28",
    currentEpoch: {
      stake: "17776328380244893436869022330562",
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
    },
    nextEpoch: {
      stake: "17777040818619949427934165446355",
    },
    poolInfo: {
      fee: {
        numerator: 1,
        denominator: 100,
      },
      delegatorsCount: 1774,
    },
    telemetry: {
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
    description: {
      twitter: "@astrostakers",
      url: "astrostakers.com",
      email: "heyheyhey@astrostakers.com",
      description:
        "1% fee in perpetuity secured for NEAR community. Run by Silicon Valley engineers for service permanent availability. We drop rhymes, not blocks",
      countryCode: "AQ",
    },
  },
  // joining
  {
    accountId: "baziliknear.poolv1.near",
    publicKey: "ed25519:E4LAWdgLifBEoaWvhRNy5vpdAnUc3GsUHePeiAurZY5v",
    nextEpoch: {
      stake: "3735553291238507324807526403326",
    },
    afterNextEpoch: {
      stake: "3736122287791333873791529790832",
    },
    poolInfo: {
      fee: {
        numerator: 3,
        denominator: 100,
      },
      delegatorsCount: 148,
    },
    telemetry: {
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
    description: {
      email: "baziliknear@gmail.com",
      description: "pool commission 0% until 01.01.2021, then 1%",
      twitter: "etherscaam",
    },
  },
  // proposal
  {
    accountId: "cryptium.poolv1.near",
    publicKey: "ed25519:5Y9hW8cKBb5RnsJBqttHHC5ujz5zcZZ5xnrJPwkCWmGQ",
    afterNextEpoch: {
      stake: "2656963060607021394774204108064",
    },
    poolInfo: {
      fee: {
        numerator: 5,
        denominator: 100,
      },
      delegatorsCount: 129,
    },
    telemetry: {
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
    description: {
      countryCode: "CH",
      description: "Secure and available validation from the Swiss Alps!",
      email: "hello@cryptium.ch",
      twitter: "CryptiumLabs",
      url: "https://cryptium.ch/",
    },
  },
  // newcomer
  {
    accountId: "huobipool.poolv1.near",
    contractStake: "1200162400050342684350218962960",
    poolInfo: {
      fee: {
        numerator: 10,
        denominator: 100,
      },
      delegatorsCount: 10,
    },
  },
  // idle
  {
    accountId: "ashert.poolv1.near",
    contractStake: "442471954465888931932802773752",
    telemetry: {
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
    poolInfo: {
      fee: {
        numerator: 7,
        denominator: 100,
      },
      delegatorsCount: 9,
    },
  },
  // idle with minimum data
  {
    accountId: "sphere.poolv1.near",
    contractStake: "50000867090131772400000000",
    poolInfo: {
      fee: {
        numerator: 8,
        denominator: 100,
      },
      delegatorsCount: 1,
    },
  },
  // leaving
  {
    accountId: "01node.poolv1.near",
    publicKey: "ed25519:5xz7EbcnPqabwoFezdJBxieK8S7XLsdHHuLwM4vLLhFt",
    currentEpoch: {
      stake: "3632096312066963778697815591239",
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
    },
    poolInfo: {
      fee: {
        numerator: 1,
        denominator: 100,
      },
      delegatorsCount: 512,
    },
    telemetry: {
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
    description: {
      countryCode: "ro",
      email: "hello@01node.com",
      description:
        "01node Professional Staking Services for Near, Skale, Solana, Cosmos, Iris",
      twitter: "@01node",
      url: "https://01node.com/",
    },
  },
];
