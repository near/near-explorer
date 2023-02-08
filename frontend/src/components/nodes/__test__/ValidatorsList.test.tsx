import ValidatorsList from "@explorer/frontend/components/nodes/ValidatorsList";
import { renderElement } from "@explorer/frontend/testing/utils";

import { getCumulativeStake, VALIDATORS_LIST } from "./validators";

const totalStake = getCumulativeStake(
  VALIDATORS_LIST[VALIDATORS_LIST.length - 1]
);

describe("<ValidatorsList />", () => {
  it("renders validators list", () => {
    expect(
      renderElement(
        <ValidatorsList
          validators={VALIDATORS_LIST.slice(0, 5)}
          selectedPageIndex={0}
          totalStake={totalStake.toString()}
        />
      )
    ).toMatchSnapshot();
  });
});
