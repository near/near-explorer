import { renderI18nElement } from "../../../libraries/tester";

import ValidatorRow from "../ValidatorRow";

import { VALIDATORS_LIST, VALIDATORS_TOTAL_STAKE } from "./validators";

describe("<ValidatorRow />", () => {
  it("renders simple 'active' Validators row", () => {
    expect(
      renderI18nElement(
        <ValidatorRow
          key={VALIDATORS_LIST[0].account_id}
          node={VALIDATORS_LIST[0]}
          totalStake={VALIDATORS_TOTAL_STAKE}
          index={1}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders 'active' Validators row without 'poolDetails'", () => {
    expect(
      renderI18nElement(
        <ValidatorRow
          key={VALIDATORS_LIST[1].account_id}
          node={VALIDATORS_LIST[1]}
          totalStake={VALIDATORS_TOTAL_STAKE}
          index={2}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders 'active' Validators row with full data", () => {
    expect(
      renderI18nElement(
        <ValidatorRow
          key={VALIDATORS_LIST[2].account_id}
          node={VALIDATORS_LIST[2]}
          totalStake={VALIDATORS_TOTAL_STAKE}
          index={3}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders 'idle' Validators row with minimum data", () => {
    expect(
      renderI18nElement(
        <ValidatorRow
          key={VALIDATORS_LIST[7].account_id}
          node={VALIDATORS_LIST[7]}
          totalStake={VALIDATORS_TOTAL_STAKE}
          index={4}
        />
      )
    ).toMatchSnapshot();
  });
});
