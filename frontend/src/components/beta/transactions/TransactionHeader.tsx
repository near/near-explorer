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

const TransactionHash = styled("h1", {
  fontSize: 36,
  fontWeight: 700,
  color: "#fff",
  lineHeight: "27px",
  marginRight: 14,
});

const TransactionCopy = styled("span", {
  marginLeft: ".5em",
});

const PendingTime = styled("div", {
  color: "#fff",
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
  margin: "0 40px",
});

const AmountHeader = styled("div", {
  fontSize: 12,
  color: "#c9c9c9",
});

const Amount = styled("div", {
  fontWeight: 500,
  fontSize: 24,
  color: "#fff",
  marginTop: 16,
});

const TransactionHeader: React.FC<Props> = React.memo(({ transaction }) => {
  const { t } = useTranslation();
  const start = Moment(transaction.created.timestamp);
  const end = Moment(
    transaction.receipt.outgoingReceipts[
      transaction.receipt.outgoingReceipts.length - 1
    ]?.includedInBlock.timestamp
  );
  const pending = end.from(start, true);
  return (
    <Wrapper>
      <BaseInfo>
        <div>
          <TransactionHash>
            {`${transaction.hash.slice(0, 7)}...${transaction.hash.slice(-4)}`}
            <TransactionCopy>
              <CopyToClipboard text={transaction.hash} />
            </TransactionCopy>
          </TransactionHash>
          <BaseInfoDetails>
            <PendingTime>
              {t("pages.transaction.header.processed")}
              <b>{pending}</b>
            </PendingTime>
            <TransactionStatus status={transaction.status} />
          </BaseInfoDetails>
        </div>
      </BaseInfo>
      <NumericInfo>
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
