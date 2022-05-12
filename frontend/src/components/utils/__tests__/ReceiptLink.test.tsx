import { renderElement } from "../../../testing/utils";

import ReceiptLink from "../ReceiptLink";

describe("<ReceiptLink />", () => {
  it("renders successfully in existing transaction", () => {
    expect(
      renderElement(
        <ReceiptLink
          transactionHash={"66WYKL9FcK1Av1WffDYwftm6t4iwUkJrnfZPjvZgsEB7"}
          receiptId={"FNNA1kX7mBPZ5LD7t8RFAVNybvybVr8h5o3n5Xw86hUW"}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders successfully in non existing transaction", () => {
    expect(
      renderElement(
        <ReceiptLink
          transactionHash="hash"
          receiptId={"9zSjvFzm6BeNsco3fdNWqKNaYFkrj94AWWfGvgssQJuG"}
        />
      )
    ).toMatchSnapshot();
  });
});
