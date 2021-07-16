import { renderI18nElement } from "../../../libraries/test";

import NodeRow from "../NodeRow";

describe("<NodeRow />", () => {
  it("renders", () => {
    expect(
      renderI18nElement(
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
            latitude: 38.7936,
            longitude: -90.7854,
            city: "",
          }}
          index={1}
        />
      )
    ).toMatchSnapshot();
  });
});
