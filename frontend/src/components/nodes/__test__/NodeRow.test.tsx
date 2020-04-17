import renderer from "react-test-renderer";

import NodeRow from "../NodeRow";

describe("<NodeRow />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <NodeRow
          node={{
            ipAddress: "1.1.1.1",
            moniker: "",
            accountId: "",
            nodeId: "",
            lastSeen: 12345,
            lastHeight: 12345,
            lastHash: "null",
            signature: "null",
            agentName: "null",
            agentVersion: "null",
            agentBuild: "null",
            peerCount: "0",
            isValidator: true,
            status: "Sync"
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
