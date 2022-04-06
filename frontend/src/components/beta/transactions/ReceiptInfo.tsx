import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";
import { Tabs } from "../common/Tabs";

import ReceiptDetails from "./ReceiptDetails";
import InspectReceipt from "./InspectReceipt";

type Props = {
  isRowActive: boolean;
  receipt: any;
};

const Wrapper = styled("div", {
  paddingVertical: 24,
  // TODO: Place a proper padding here
  paddingHorizontal: 40,
  display: "flex",
  flexDirection: "column",
  // justifyContent: "space-between",
  fontFamily: "Manrope",
});

const TabLabel = styled("div", {
  display: "flex",
});

const ReceiptInfo: React.FC<Props> = React.memo(({ isRowActive, receipt }) => {
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
            node: <InspectReceipt receipt={receipt} />,
          },
        ]}
      />
    </Wrapper>
  );
});

export default ReceiptInfo;
