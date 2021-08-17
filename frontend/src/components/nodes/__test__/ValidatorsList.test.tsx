import { renderI18nElement } from "../../../libraries/tester";

import ValidatorsList from "../ValidatorsList";

describe("<ValidatorsList />", () => {
  it("renders validators list", () => {
    expect(
      renderI18nElement(
        <ValidatorsList
          validators={[
            {
              account_id: "astro-stakers.poolv1.near",
              public_key:
                "ed25519:2nPSBCzjqikgwrqUMcuEVReJhmkC91eqJGPGqH9sZc28",
              is_slashed: false,
              stake: "19407279887998349415757948956056",
              stakeProposed: "3698682660611159350484077444377",
              stakingStatus: "new",
              shards: [0],
              num_produced_blocks: 66,
              num_expected_blocks: 66,
              nodeInfo: {
                ipAddress: "127.0.0.1",
                nodeId: "ed25519:3iNqnvBgxJPXCxu6hNdvJso1PEAc1miAD35KQMBCA3a2",
                lastSeen: 1619759139685,
                lastHeight: 5221,
                status: "NoSync",
                agentName: "near-rs",
                agentVersion: "0.4.13",
                agentBuild: "frol",
                latitude: null,
                longitude: null,
                city: null,
              },
              poolDetails: {
                country_code: "us",
                description: "Test description 1",
                discord: "https://discord.com",
                email: "testemail@email.com",
                twitter: "@test1",
                url: "explorer.near.org",
              },
              fee: { numerator: 1, denominator: 100 },
              delegators: 1304,
            },
            {
              account_id: "audit_one.poolv1.near",
              public_key:
                "ed25519:9x2LqdGVL8MKbAziezMhQjPCKKeFAaExeyJpVvBvGuAC",
              is_slashed: false,
              stake: "3698682660611159350484077444377",
              stakeProposed: "4792255943512030289565031148674",
              stakingStatus: "active",
              shards: [0],
              num_produced_blocks: 13,
              num_expected_blocks: 13,
              nodeInfo: undefined,
              poolDetails: {
                country_code: "us",
                description: "Test description 2",
                discord: "https://discord.com",
                email: "testemail@email.com",
                twitter: "@test2",
              },
              fee: { numerator: 7, denominator: 100 },
              delegators: 27,
            },
            {
              account_id: "baziliknear.poolv1.near",
              public_key:
                "ed25519:E4LAWdgLifBEoaWvhRNy5vpdAnUc3GsUHePeiAurZY5v",
              is_slashed: false,
              stake: "4035443453308274806004526027644",
              stakeProposed: "4792255943512030289565031148674",
              stakingStatus: "leaving",
              shards: [0],
              num_produced_blocks: 14,
              num_expected_blocks: 14,
              nodeInfo: undefined,
              poolDetails: undefined,
              fee: { numerator: 3, denominator: 100 },
              delegators: 135,
            },
            {
              account_id: "certusone.poolv1.near",
              delegatorsCount: 70,
              fee: { numerator: 10, denominator: 100 },
              is_slashed: false,
              nodeInfo: {
                agentBuild: "add9c96",
                agentName: "near-rs",
                agentVersion: "1.19.1",
                city: "",
                ipAddress: "136.243.174.81",
                lastHeight: 38640007,
                lastSeen: 1622326211447,
                latitude: 51.2993,
                longitude: 9.491,
                nodeId: "ed25519:2NLH94qBNdkLj5ZgBjhoCY12Vc9Eq31ApTebPJPXdDbw",
              },
              num_expected_blocks: 403,
              num_produced_blocks: 403,
              poolDetails: {},
              public_key:
                "ed25519:4kwUVNSZ61BT3xbc1fL718UP2RqgvMa5aAYBaoav1wvk",
              shards: [0],
              stake: "3714536522221206610081191779770",
              stakeProposed: "3710128058030212408553830293257",
              stakingStatus: "on-hold",
            },
            {
              account_id: "genesislab.poolv1.near",
              public_key: undefined,
              is_slashed: false,
              stake: "4035443453308274806004526027644",
              stakeProposed: "4792255943512030289565031148674",
              stakingStatus: "proposal",
              shards: [0],
              num_produced_blocks: 15,
              num_expected_blocks: 15,
              nodeInfo: {
                ipAddress: "95.217.116.75",
                nodeId: "ed25519:DTZFKmne5V31iWqkPGUSusKWP44a36ixUq12RA2Jg2PV",
                lastSeen: 1622510962471,
                lastHeight: 38825417,
                status: "NoSync",
                agentName: "near-rs",
                agentVersion: "1.19.0",
                agentBuild: "9a7d172a",
                latitude: 60.1708,
                longitude: 24.9375,
                city: "",
              },
              poolDetails: {
                description:
                  "Genesis Lab is a blockchain-focused development company and trusted Proof-of-Stake validator to comfortably stake your coins and earn rewards with Near, Cosmos, Polkadot, IRIS, Kusama, Kava, Terra and other networks.",
                name: "Genesis Lab",
                country_code: "RU",
                logo: "https://genesislab.net/img/logo.png",
                github: "genesis-lab-team",
                url: "https://genesislab.net",
                email: "team@genesislab.net",
                twitter: "genesislab_net",
                telegram: "GenesisLab_EN",
              },
              fee: { numerator: 4, denominator: 100 },
              delegators: 70,
            },
            {
              account_id: "huobipool.poolv1.near",
              delegatorsCount: 11,
              fee: { numerator: 10, denominator: 100 },
              poolDetails: {},
              stake: "1206083136032440029235935628243",
              stakingStatus: "newcomer",
            },
          ]}
          pages={{
            startPage: 1,
            endPage: 5,
            activePage: 2,
            itemsPerPage: 12,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
