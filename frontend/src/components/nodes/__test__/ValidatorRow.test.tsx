import BN from "bn.js";

import { renderI18nElement } from "../../../libraries/tester";

import ValidatorRow from "../ValidatorRow";

describe("<ValidatorRow />", () => {
  it("renders full Validators row", () => {
    expect(
      renderI18nElement(
        <ValidatorRow
          key="dokiacapital.pool.6fb1358"
          node={{
            account_id: "dokiacapital.pool.6fb1358",
            is_slashed: false,
            num_expected_blocks: 1771,
            num_produced_blocks: 1768,
            public_key: "ed25519:935JMz1vLcJxFApG3TY4MA4RHhvResvoGwCrQoJxHPn9",
            shards: [0],
            stake: "91037770393145811562101780866",
            stakeProposed: "4792255943512030289565031148674",
            cumulativeStakeAmount: new BN("91037770393145811562101780866"),
            networkHolder: true,
            validatorStatus: "active",
            poolDetails: {
              country_code: "us",
              description: "Test description 1",
              discord: "https://discord.com",
              email: "testemail@email.com",
              twitter: "@test1",
              url: "explorer.near.org",
            },
            fee: { numerator: 10, denominator: 100 },
            delegatorsCount: 11,
          }}
          totalStake={new BN("91037770393145811562101780866")}
          index={1}
          cellCount={8}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders Validators row without cumulative stake", () => {
    expect(
      renderI18nElement(
        <ValidatorRow
          key="dokiacapital.pool.6fb1358"
          node={{
            account_id: "dokiacapital.pool.6fb1358",
            is_slashed: false,
            num_expected_blocks: 1771,
            num_produced_blocks: 1768,
            public_key: "ed25519:935JMz1vLcJxFApG3TY4MA4RHhvResvoGwCrQoJxHPn9",
            shards: [0],
            stake: "91037770393145811562101780866",
            stakeProposed: "4792255943512030289565031148674",
            networkHolder: true,
            validatorStatus: "leaving",
            poolDetails: {
              description: "Test description 2",
              discord: "https://discord.com",
              email: "testemail@email.com",
              twitter: "@test2",
              url: "explorer.near.org",
            },
            fee: { numerator: 10, denominator: 100 },
            delegatorsCount: 11,
          }}
          totalStake={new BN("91037770393145811562101780866")}
          index={2}
          cellCount={8}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders simple Validators row", () => {
    expect(
      renderI18nElement(
        <ValidatorRow
          key="dokiacapital.pool.6fb1358"
          node={{
            account_id: "dokiacapital.pool.6fb1358",
            is_slashed: false,
            num_expected_blocks: 1771,
            num_produced_blocks: 1768,
            public_key: "ed25519:935JMz1vLcJxFApG3TY4MA4RHhvResvoGwCrQoJxHPn9",
            shards: [0],
            stake: "91037770393145811562101780866",
            stakeProposed: "4792255943512030289565031148674",
            networkHolder: true,
            poolDetails: undefined,
            fee: { numerator: 10, denominator: 100 },
            delegatorsCount: 11,
          }}
          totalStake={new BN("91037770393145811562101780866")}
          index={3}
          cellCount={8}
        />
      )
    ).toMatchSnapshot();
  });
});
