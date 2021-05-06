import renderer from "react-test-renderer";

import NodesEpoch from "../NodesEpoch";

describe("<NodesEpoch />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <NodesEpoch
          epochStartBlock={{
            gasUsed: "5728980156616",
            gasPrice: "100000000",
            hash: "Hk7qfJqqn1BV2hsz3a4s5a7tmcCgSDx4PVf3T6mcMTf6",
            height: 36647454,
            prevHash: "EGKpS8AguX6DWTGcX2LAsv2oJTggJef49ojjStRqMQsQ",
            timestamp: 1620305916060,
            totalSupply: "1026697138447885703199686999754199",
            transactionsCount: 1,
          }}
          epochStartHeight={36647454}
        />
      )
    ).toMatchSnapshot();
  });
});
