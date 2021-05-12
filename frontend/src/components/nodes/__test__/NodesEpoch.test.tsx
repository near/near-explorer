import renderer from "react-test-renderer";

import NodesEpoch from "../NodesEpoch";

describe("<NodesEpoch />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <NodesEpoch
          epochLength={43200}
          epochStartHeight={36647454}
          latestBlockHeight={36647454 + 21600}
          epochStartTimestamp={1620305916060}
          latestBlockTimestamp={1620305916060 + 1000 * 60 * 60 * 6}
        />
      )
    ).toMatchSnapshot();
  });
});
