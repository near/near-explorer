import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";
import { RefundReceipt, TransactionReceipt } from "../../../types/transaction";

import { Tabs } from "../common/Tabs";
import ReceiptDetails from "./ReceiptDetails";
import InspectReceipt from "./InspectReceipt";

type Props = {
  isRowActive: boolean;
  receipt: TransactionReceipt;
  refundReceipt: RefundReceipt;
};

const Wrapper = styled("div", {
  paddingVertical: 24,
  // TODO: Place a proper padding here
  paddingHorizontal: 40,
  display: "flex",
  flexDirection: "column",
  fontFamily: "Manrope",
});

const TabLabel = styled("div", {
  display: "flex",
});

const ReceiptInfo: React.FC<Props> = React.memo(
  ({ isRowActive, receipt, refundReceipt }) => {
    const { t } = useTranslation();
    if (!isRowActive) {
      return null;
    }
    return (
      <Wrapper>
        <Tabs
          tabs={[
            {
              id: "details",
              label: <TabLabel>{t("pages.transaction.tabs.details")}</TabLabel>,
              node: <ReceiptDetails receipt={receipt} />,
            },
            {
              id: "inspect",
              label: <TabLabel>{t("pages.transaction.tabs.inspect")}</TabLabel>,
              node: (
                <InspectReceipt
                  receipt={receipt}
                  refundReceipt={refundReceipt}
                />
              ),
            },
          ]}
        />
      </Wrapper>
    );
  }
);

export default ReceiptInfo;
