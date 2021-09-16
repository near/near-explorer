import { renderI18nElement } from "../../../libraries/tester";

import ValidatorsList from "../ValidatorsList";

import { VALIDATORS_LIST } from "./validators";

describe("<ValidatorsList />", () => {
  it("renders validators list", () => {
    expect(
      renderI18nElement(
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
