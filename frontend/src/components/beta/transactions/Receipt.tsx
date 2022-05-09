import * as React from "react";
import { useTranslation } from "react-i18next";

import { styled } from "../../../libraries/styles";
import { TransactionReceipt } from "../../../types/common";
import { NearAmount } from "../../utils/NearAmount";

import AccountLink from "../common/AccountLink";
// import TransactionType from "./TransactionType";

type Props = {
  onClick: React.MouseEventHandler;
  receipt: TransactionReceipt;
};

const Row = styled("div", {
  width: "100%",
  padding: 20,
  display: "flex",
  background: "#fff",
  boxShadow: "0px 0px 30px rgba(66, 0, 255, 0.05)",
  borderRadius: 6,
});

const Arrow = styled("img", {
  width: 17,
});

const AccountInfo = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flex: "1 0 auto",
});

const Divider = styled("div", {
  height: "100%",
  width: 1,
  margin: "0 16px",
});

const AmountHeader = styled("div", {
  fontSize: 12,
  color: "#616161",
  width: 125,
});

const Amount = styled("div", {
  fontWeight: 600,
  fontSize: 20,
  lineHeight: "30px",
  color: "#000000",
});

const Author = styled("div", {
  display: "flex",
  alignItems: "center",
});

const AccountLinkWrapper = styled("div", {
  color: "#0072ce",
  fontSize: 20,
  fontWeight: 600,
  lineHeight: "150%",
});

const Avatar = styled("div", {
  size: 17,
  backgroundColor: "#c4c4c4",
  opacity: 0.2,
  borderRadius: "50%",
  marginRight: 8,
});

const SuccessIcon = styled("img", {
  width: 11,
});

const Status = styled("div", {
  textAlign: "center",

  "& > div": {
    width: "auto",
  },
});

const Red = styled("div", {
  color: "#aa4710",
});

const Receipt: React.FC<Props> = React.memo(({ onClick, receipt }) => {
  const { t } = useTranslation();
  const status = Object.keys(receipt.status)[0];
  return (
    <Row onClick={onClick}>
      {/* <TransactionType actions={receipt.actions} /> */}
      <Divider />
      <AccountInfo>
        <div>
          <AmountHeader>{t("pages.transaction.activity.from")}</AmountHeader>
          <Amount>
            <Author>
              <Avatar />
              <AccountLinkWrapper>
                <AccountLink accountId={receipt.signerId} />
              </AccountLinkWrapper>
            </Author>
          </Amount>
        </div>
        <Divider />
        <Arrow src="/static/images/ic-from-to.svg" />
        <Divider />
        <div>
          <AmountHeader>{t("pages.transaction.activity.to")}</AmountHeader>
          <Amount>
            <Author>
              <Avatar />
              <AccountLinkWrapper>
                <AccountLink accountId={receipt.receiverId} />
              </AccountLinkWrapper>
            </Author>
          </Amount>
        </div>
        <Divider />
        <div>
          <AmountHeader>{t("pages.transaction.activity.amount")}</AmountHeader>
          <Amount>
            <NearAmount amount={receipt.deposit || "0"} decimalPlaces={2} />
          </Amount>
        </div>
        <Divider />
        <div>
          <AmountHeader>{t("pages.transaction.activity.fee")}</AmountHeader>
          <Amount>
            <NearAmount amount={receipt.tokensBurnt} decimalPlaces={2} />
          </Amount>
        </div>
        <Divider />
        <Status>
          <AmountHeader>{t("pages.transaction.activity.status")}</AmountHeader>
          <Amount>
            {["Started", "SuccessValue", "SuccessReceiptId"].indexOf(status) >=
            0 ? (
              <>
                <SuccessIcon src="/static/images/icon-success.svg" />
              </>
            ) : (
              <Red>&#10005;</Red>
            )}
          </Amount>
        </Status>
      </AccountInfo>
    </Row>
  );
});

export default Receipt;
