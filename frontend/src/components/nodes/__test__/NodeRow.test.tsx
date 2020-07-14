import renderer from "react-test-renderer";

import NodeRow from "../NodeRow";

describe("<NodeRow />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <NodeRow
          node={{
            ipAddress: "1.1.1.1",
            moniker: "alice",
            accountId: "alice",
            nodeId: "ed25519:fhgjrkfhurjtieokwpitjesdlkfjngdmloytiutkjhgkf",
            lastSeen: 1587516758449,
            lastHeight: 1889,
            lastHash: "7a4d3SNNb1XGxqhHAKj5nGx8C1R4X8pdt8jobC9z3nup",
            signature:
              "ed25519:4n5VzXijHUvgwroD1W6BTysRGKTMdPv6ks32kEUNGyb9recDYRpt2L8Y2Uq5ABPt4LZHFBAv2DPj1CAPGkwqkZg2",
            agentName: "near-rs",
            agentVersion: "0.4.5",
            agentBuild: "6a527109-modified",
            peerCount: "0",
            isValidator: true,
            status: "NoSync",
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
