import { renderElement } from "../../../testing/utils";

import CardCell from "../CardCell";

describe("<CardCell />", () => {
  it("renders", () => {
    expect(
      renderElement(<CardCell title="title" text="text" />)
    ).toMatchSnapshot();
  });
});
