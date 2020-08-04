import renderer from "react-test-renderer";

import NodeRow from "../NodeRow";

describe("<NodeRow />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <NodeRow
          node={{
            ipAddress: "1.1.1.1",
            accountId: "alice",
            nodeId: "ed25519:fhgjrkfhurjtieokwpitjesdlkfjngdmloytiutkjhgkf",
            lastSeen: 1587516758449,
            lastHeight: 1889,
            agentName: "near-rs",
            agentVersion: "0.4.5",
            agentBuild: "6a527109-modified",
            status: "NoSync",
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
