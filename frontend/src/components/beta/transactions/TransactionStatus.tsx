import * as React from "react";

import { useTranslation } from "next-i18next";

import { TransactionStatus } from "@/common/types/procedures";
import { styled } from "@/frontend/libraries/styles";

type Props = {
  status: TransactionStatus;
};

const Label = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 20,
  borderRadius: 4,
  fontSize: 10,
  fontWeight: 700,
  color: "#fff",
  lineHeight: "150%",
  textTransform: "uppercase",
  paddingHorizontal: 7.5,

  variants: {
    type: {
      unknown: {
        backgroundColor: "#38abb2",
      },
      failure: {
        background: "#aa4710",
      },
      success: {
        background: "#10aa7f",
      },
    },
  },
});

const TransactionStatusView: React.FC<Props> = React.memo(({ status }) => {
  const { t } = useTranslation();
  return (
    <Label type={status}>{t(`common.transactions.status.${status}`)}</Label>
  );
});

export default TransactionStatusView;
