import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@explorer/frontend/libraries/styles";
import { TransactionReceipt } from "@explorer/common/types/procedures";

import { Tabs } from "@explorer/frontend/components/beta/common/Tabs";
import ReceiptDetails from "@explorer/frontend/components/beta/transactions/ReceiptDetails";
import InspectReceipt from "@explorer/frontend/components/beta/transactions/InspectReceipt";

type Props = {
  receipt: TransactionReceipt;
};

const TabsWrapper = styled("div", {
  padding: "0 40px",
  display: "flex",
  flexDirection: "column",
  fontFamily: "Manrope",

  "& > div": {
    "& > div:first-child > div": {
      margin: "16px 36px",

      "&:last-child": {
        margin: 0,
        bottom: 6,
      },
    },
  },
});

const TabLabel = styled("div", {
  display: "flex",
});

const ReceiptInfo: React.FC<Props> = React.memo(({ receipt }) => {
  const { t } = useTranslation();
  return (
    <TabsWrapper>
      <Tabs
        tabs={[
          {
            id: "output",
            label: <TabLabel>{t("pages.transaction.tabs.output")}</TabLabel>,
            node: <ReceiptDetails receipt={receipt} />,
          },
          {
            id: "inspect",
            label: <TabLabel>{t("pages.transaction.tabs.inspect")}</TabLabel>,
            node: <InspectReceipt receipt={receipt} />,
          },
        ]}
      />
    </TabsWrapper>
  );
});

export default ReceiptInfo;
