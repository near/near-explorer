import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";
import Moment from "../../../libraries/moment";

import CopyToClipboard from "../../beta/common/CopyToClipboard";
import { NearAmount } from "../../utils/NearAmount";
import TransactionStatus from "./TransactionStatus";
import { TransactionDetails } from "../../../types/common";

type Props = {
  transaction: TransactionDetails;
};

const Wrapper = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: 1196,
  backgroundColor: "#1b1d1f",
  margin: "32px auto",
  padding: 28,
  borderRadius: 8,
  fontFamily: "Manrope",
});

const BaseInfo = styled("div", {
  display: "flex",
});

const AuthorInfo = styled("div", {
  display: "flex",
  alignItems: "center",
});

const Author = styled("div", {
  display: "flex",
  alignItems: "center",
  // fontFamily: "SF Pro Display",
  color: "#fff",
  fontWeight: 700,
  fontSize: 30,
  lineHeight: "150%",
});
const Avatar = styled("div", {
  size: 26,
  backgroundColor: "#c4c4c4",
  opacity: 0.2,
  borderRadius: "50%",
  marginRight: 8,
});

const Divider = styled("img", {
  width: 17,
  marginHorizontal: 20,
});

const TransactionHash = styled("h1", {
  fontFamily: "SF Pro Display",
  fontSize: 18,
  fontWeight: 400,
  color: "#fff",
  lineHeight: "21px",
  marginRight: 14,
  marginLeft: 34,
  marginBottom: 0,
});

const TransactionCopy = styled("span", {
  marginLeft: ".5em",
});

const BaseInfoDetails = styled("div", {
  display: "flex",
  alignItems: "center",
  marginTop: 24,
});

const NumericInfo = styled("div", {
  display: "flex",
  alignItems: "center",
});
const NumericDivider = styled("div", {
  height: "100%",
  width: 1,
  margin: "0 20px",
});

const AmountHeader = styled("div", {
  fontSize: 12,
  color: "#c9c9c9",
  lineHeight: "45px",
  fontFamily: "SF Pro Display",
});

const Amount = styled("div", {
  fontWeight: 500,
  fontSize: 20,
  color: "#fff",
  marginTop: 16,
  fontFamily: "SF Mono",
});

const TransactionHeader: React.FC<Props> = React.memo(({ transaction }) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <BaseInfo>
        <div>
          <AuthorInfo>
            <Author>
              <Avatar />
              <span>{transaction.transaction.signer_id}</span>
            </Author>
            <Divider src="/static/images/icon-from-arrow-right.svg" />
            <Author>
              <Avatar />
              <span>{transaction.transaction.receiver_id}</span>
            </Author>
          </AuthorInfo>
          <BaseInfoDetails>
            <TransactionHash>
              {`${transaction.hash.slice(0, 7)}...${transaction.hash.slice(
                -4
              )}`}
              {/* {transaction.hash} */}
              <TransactionCopy>
                <CopyToClipboard text={transaction.hash} />
              </TransactionCopy>
            </TransactionHash>
            <TransactionStatus status={transaction.status} />
          </BaseInfoDetails>
        </div>
      </BaseInfo>
      <NumericInfo>
        <div>
          <AmountHeader>{t("pages.transaction.header.amount")}</AmountHeader>
          <Amount>
            <NearAmount
              amount={transaction.transactionAmount}
              decimalPlaces={2}
            />
          </Amount>
        </div>
        <NumericDivider />
        <div>
          <AmountHeader>{t("pages.transaction.header.fee")}</AmountHeader>
          <Amount>
            <NearAmount amount={transaction.transactionFee} decimalPlaces={2} />
          </Amount>
        </div>
        <NumericDivider />
        <div>
          <AmountHeader>{t("pages.transaction.header.when")}</AmountHeader>
          <Amount>
            {Moment(transaction.created.timestamp).format(
              t("pages.transaction.dateFormat")
            )}
          </Amount>
        </div>
      </NumericInfo>
    </Wrapper>
  );
});

export default TransactionHeader;
