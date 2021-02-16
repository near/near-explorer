import renderer from "react-test-renderer";

import ProposalRow from "../ProposalRow";

describe("<ProposalRow />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <ProposalRow
          node={{
            accountId: "dokiacapital.pool.6fb1358",
            publicKey: "ed25519:935JMz1vLcJxFApG3TY4MA4RHhvResvoGwCrQoJxHPn9",
            stake: "91037770393145811562101780866",
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
