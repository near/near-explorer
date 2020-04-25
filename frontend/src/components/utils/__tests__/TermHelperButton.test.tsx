import renderer from "react-test-renderer";

import TermHelperButton from "../TermHelperButton";

describe("<CardCell />", () => {
  it("renders", () => {
    expect(
      renderer.create(
        <TermHelperButton title={"Nodes Online"}>
          {
            "The number of validating nodes / the total number of online nodes. "
          }
          <a
            href={
              "https://docs.nearprotocol.com/docs/roles/integrator/faq#validators"
            }
          >
            docs
          </a>
        </TermHelperButton>
      )
    ).toMatchSnapshot();
  });
});
