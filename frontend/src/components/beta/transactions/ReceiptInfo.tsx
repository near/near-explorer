import * as React from "react";

import { useTranslation } from "next-i18next";

import { TransactionReceipt } from "@/common/types/procedures";
import { Tabs } from "@/frontend/components/beta/common/Tabs";
import { InspectReceipt } from "@/frontend/components/beta/transactions/InspectReceipt";
import { ReceiptDetails } from "@/frontend/components/beta/transactions/ReceiptDetails";
import { styled } from "@/frontend/libraries/styles";

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

export const ReceiptInfo: React.FC<Props> = React.memo(({ receipt }) => {
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
