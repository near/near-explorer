import renderer from "react-test-renderer";

import ReceiptsList from "../ReceiptsList";

import { TRANSACTIONS } from "./common";

describe("<ReceiptsList />", () => {
  it("renders", () => {
    expect(
      renderer.create(<ReceiptsList receipt={TRANSACTIONS[0].receipt as any} />)
    ).toMatchSnapshot();
  });
});
