import renderer from "react-test-renderer";

import ValidatorRow from "../ValidatorRow";

describe("<ValidatorRow />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <ValidatorRow
          node={{
            account_id: "dokiacapital.pool.6fb1358",
            is_slashed: false,
            num_expected_blocks: 1771,
            num_produced_blocks: 1768,
            public_key: "ed25519:935JMz1vLcJxFApG3TY4MA4RHhvResvoGwCrQoJxHPn9",
            shards: [0],
            stake: "91037770393145811562101780866",
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
