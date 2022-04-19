import { renderElement } from "../../../testing/utils";

import ValidatorsList from "../ValidatorsList";

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
