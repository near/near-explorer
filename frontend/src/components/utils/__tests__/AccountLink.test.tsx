import renderer from "react-test-renderer";

import AccountLink from "../AccountLink";

describe("<AccountLink />", () => {
  it("renders", () => {
    expect(renderer.create(<AccountLink accountId="test" />)).toMatchSnapshot();
  });
});
