import BN from "bn.js";

import renderer from "react-test-renderer";

import ValidatorRow from "../ValidatorRow";

describe("<ValidatorRow />", () => {
  it("renders row on Validators tab", () => {
    expect(
      renderer.create(
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
            cumulativeStakeAmount: {
              total: new BN("91037770393145811562101780866"),
              networkHolderIndex: 0,
            },
            totalStake: new BN("91037770393145811562101780866"),
            fee: { numerator: 10, denominator: 100 },
            delegatorsCount: 11,
          }}
          index={1}
          cellCount={7}
          validatorType="validators"
        />
      )
    ).toMatchSnapshot();
  });

  it("renders row on Proposals tab", () => {
    expect(
      renderer.create(
        <ValidatorRow
          key="magic.poolv1.near"
          node={{
            account_id: "magic.poolv1.near",
            public_key: "ed25519:5fwufMXx9CTyLRkz7x3htQa3rFGzFZuz6d43LhCTmKCS",
            stake: "10831273779812239906416722375682",
            cumulativeStakeAmount: {
              total: new BN("10831273779812239906416722375682"),
              networkHolderIndex: 0,
            },
            totalStake: new BN("10831273779812239906416722375682"),
            fee: { numerator: 100, denominator: 100 },
            delegatorsCount: 121,
          }}
          index={1}
          cellCount={6}
          validatorType="proposals"
        />
      )
    ).toMatchSnapshot();
  });
});
