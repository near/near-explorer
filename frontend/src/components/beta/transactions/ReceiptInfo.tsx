import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";
import { RefundReceipt, TransactionReceipt } from "../../../types/common";

import { Tabs } from "../common/Tabs";
import ReceiptDetails from "./ReceiptDetails";
import InspectReceipt from "./InspectReceipt";

type Props = {
  isRowActive: boolean;
  receipt: TransactionReceipt;
  refundReceipts?: RefundReceipt[];
};

const Wrapper = styled("div", {
  padding: "24px 40px",
  display: "flex",
  flexDirection: "column",
  fontFamily: "Manrope",
});

const TabLabel = styled("div", {
  display: "flex",
});

const ReceiptInfo: React.FC<Props> = React.memo(
  ({ isRowActive, receipt, refundReceipts }) => {
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
                  refundReceipts={refundReceipts}
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
