import { renderI18nElement } from "../../../libraries/test";

import ReceiptLink from "../ReceiptLink";

describe("<ReceiptLink />", () => {
  it("renders successfully in existing transaction", () => {
    expect(
      renderI18nElement(
        <ReceiptLink
          transactionHash={"66WYKL9FcK1Av1WffDYwftm6t4iwUkJrnfZPjvZgsEB7"}
          receiptId={"FNNA1kX7mBPZ5LD7t8RFAVNybvybVr8h5o3n5Xw86hUW"}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders successfully in non existing transaction", () => {
    expect(
      renderI18nElement(
        <ReceiptLink
          receiptId={"9zSjvFzm6BeNsco3fdNWqKNaYFkrj94AWWfGvgssQJuG"}
        />
      )
    ).toMatchSnapshot();
  });
});
