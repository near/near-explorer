import { renderElement } from "@explorer/frontend/testing/utils";

import Term from "@explorer/frontend/components/utils/Term";

describe("<CardCell />", () => {
  it("renders", () => {
    expect(
      renderElement(
        <Term
          title={"Nodes Online"}
          text={
            "The number of validating nodes / the total number of online nodes. "
          }
          href={"https://docs.near.org/docs/roles/integrator/faq#validators"}
        />
      )
    ).toMatchSnapshot();
  });
});
