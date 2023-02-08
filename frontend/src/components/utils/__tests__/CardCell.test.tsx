import CardCell from "@explorer/frontend/components/utils/CardCell";
import { renderElement } from "@explorer/frontend/testing/utils";

describe("<CardCell />", () => {
  it("renders", () => {
    expect(
      renderElement(<CardCell title="title" text="text" />)
    ).toMatchSnapshot();
  });
});
