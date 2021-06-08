import renderer from "react-test-renderer";

import ReceiptLink from "../ReceiptLink";

describe("<ReceiptLink />", () => {
  it("renders successfully in existing transaction", () => {
    expect(
      renderer.create(
        <ReceiptLink
          transactionHash={"66WYKL9FcK1Av1WffDYwftm6t4iwUkJrnfZPjvZgsEB7"}
          receiptId={"FNNA1kX7mBPZ5LD7t8RFAVNybvybVr8h5o3n5Xw86hUW"}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders successfully in non existing transaction", () => {
    expect(
      renderer.create(
        <ReceiptLink
          receiptId={"9zSjvFzm6BeNsco3fdNWqKNaYFkrj94AWWfGvgssQJuG"}
        />
      )
    ).toMatchSnapshot();
  });
});
