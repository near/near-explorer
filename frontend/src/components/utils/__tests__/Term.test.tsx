import renderer from "react-test-renderer";

import Term from "../Term";

describe("<CardCell />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <Term title={"Nodes Online"}>
          {
            "The number of validating nodes / the total number of online nodes. "
          }
          <a
            href={"https://docs.near.org/docs/roles/integrator/faq#validators"}
          >
            docs
          </a>
        </Term>
      )
    ).toMatchSnapshot();
  });
});
