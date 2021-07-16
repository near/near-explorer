import { renderI18nElement } from "../../../libraries/tester";

import CardCell from "../CardCell";

describe("<CardCell />", () => {
  it("renders", () => {
    expect(
      renderI18nElement(<CardCell title="title" text="text" />)
    ).toMatchSnapshot();
  });
});
