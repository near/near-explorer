import { renderI18nElement } from "../../../libraries/test";

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
              fee: { numerator: 1, denominator: 100 },
              delegators: 1304,
            },
            {
              account_id: "audit_one.poolv1.near",
              public_key:
                "ed25519:9x2LqdGVL8MKbAziezMhQjPCKKeFAaExeyJpVvBvGuAC",
              is_slashed: false,
              stake: "3698682660611159350484077444377",
              shards: [0],
              num_produced_blocks: 13,
              num_expected_blocks: 13,
              nodeInfo: undefined,
              fee: { numerator: 7, denominator: 100 },
              delegators: 27,
            },
            {
              account_id: "baziliknear.poolv1.near",
              public_key:
                "ed25519:E4LAWdgLifBEoaWvhRNy5vpdAnUc3GsUHePeiAurZY5v",
              is_slashed: false,
              stake: "4035443453308274806004526027644",
              shards: [0],
              num_produced_blocks: 14,
              num_expected_blocks: 14,
              nodeInfo: undefined,
              fee: { numerator: 3, denominator: 100 },
              delegators: 135,
            },
          ]}
          pages={{
            startPage: 1,
            endPage: 5,
            activePage: 2,
            itemsPerPage: 12,
          }}
          cellCount={7}
          validatorType="validators"
        />
      )
    ).toMatchSnapshot();
  });

  it("renders proposals list", () => {
    expect(
      renderI18nElement(
        <ValidatorsList
          validators={[
            {
              account_id: "astro-stakers.poolv1.near",
              public_key:
                "ed25519:2nPSBCzjqikgwrqUMcuEVReJhmkC91eqJGPGqH9sZc28",
              stake: "19378033398590857501386991485483",
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
              fee: { numerator: 1, denominator: 100 },
              delegators: 1304,
            },
            {
              account_id: "chorusone.poolv1.near",
              public_key:
                "ed25519:AZwJAgu2qRxHwdpj8ioZEFGcc2jbaZGN7ZvUe7CuXtM7",
              stake: "6174390412911417441514126546724",
              nodeInfo: undefined,
              fee: { numerator: 8, denominator: 100 },
              delegators: 125,
            },
          ]}
          pages={{
            startPage: 1,
            endPage: 5,
            activePage: 2,
            itemsPerPage: 12,
          }}
          cellCount={6}
          validatorType="proposals"
        />
      )
    ).toMatchSnapshot();
  });
});
