import { renderElement } from "@explorer/frontend/testing/utils";

import CardCell from "@explorer/frontend/components/utils/CardCell";

describe("<CardCell />", () => {
  it("renders", () => {
    expect(
      renderElement(<CardCell title="title" text="text" />)
    ).toMatchSnapshot();
  });
});
