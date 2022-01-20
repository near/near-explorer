import { renderElement } from "../../../testing/utils";

import ValidatorsList from "../ValidatorsList";

import { VALIDATORS_LIST } from "./validators";

describe("<ValidatorsList />", () => {
  it("renders validators list", () => {
    expect(
      renderElement(
        <ValidatorsList
          validators={VALIDATORS_LIST}
          pages={{
            startPage: 1,
            endPage: 5,
            activePage: 2,
            itemsPerPage: 12,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
