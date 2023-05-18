import * as React from "react";

import CardCell from "@/frontend/components/utils/CardCell";
import { renderElement } from "@/frontend/testing/utils";

describe("<CardCell />", () => {
  it("renders", () => {
    expect(
      renderElement(<CardCell title="title" text="text" />)
    ).toMatchSnapshot();
  });
});
