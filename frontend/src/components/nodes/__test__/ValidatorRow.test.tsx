import renderer from "react-test-renderer";

import ValidatorRow from "../ValidatorRow";

describe("<ValidatorRow />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <ValidatorRow
          node={{
            accountId: "dokiacapital.pool.6fb1358",
            isSlashed: false,
            numExpectedBlocks: 1771,
            numProducedBlocks: 1768,
            publicKey: "ed25519:935JMz1vLcJxFApG3TY4MA4RHhvResvoGwCrQoJxHPn9",
            shards: [0],
            stake: "91037770393145811562101780866",
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
