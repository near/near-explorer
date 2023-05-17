import * as React from "react";

import ValidatorsList from "@explorer/frontend/components/nodes/ValidatorsList";
import { renderElement } from "@explorer/frontend/testing/utils";

import { VALIDATORS_LIST } from "./validators";

describe("<ValidatorsList />", () => {
  it("renders validators list", () => {
    expect(
      renderElement(
        <ValidatorsList
          validators={VALIDATORS_LIST.slice(0, 5)}
          selectedPageIndex={0}
        />
      )
    ).toMatchSnapshot();
  });
});
