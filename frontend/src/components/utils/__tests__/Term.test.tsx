import { renderI18nElement } from "../../../libraries/test";

import Term from "../Term";

describe("<CardCell />", () => {
  it("renders", () => {
    expect(
      renderI18nElement(
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
