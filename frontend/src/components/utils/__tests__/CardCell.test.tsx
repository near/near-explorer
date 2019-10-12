import renderer from "react-test-renderer";

import CardCell from "../CardCell";

describe("<CardCell />", () => {
  it("renders", () => {
    expect(
      renderer.create(<CardCell title="title" text="text" />)
    ).toMatchSnapshot();
  });
});
