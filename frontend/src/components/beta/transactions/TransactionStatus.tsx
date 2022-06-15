import * as React from "react";
import { useTranslation } from "react-i18next";
import { TransactionDetails } from "../../../types/common";
import { styled } from "../../../libraries/styles";

type Props = {
  status: TransactionDetails["status"];
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
      fetching: {
        backgroundColor: "#38abb2",
      },
      fail: {
        background: "#aa4710",
      },
      success: {
        background: "#10aa7f",
      },
    },
  },
});

const TransactionStatus: React.FC<Props> = React.memo(({ status }) => {
  const { t } = useTranslation();
  return <Label type={status}>{t(`pages.transaction.status.${status}`)}</Label>;
});

export default TransactionStatus;
