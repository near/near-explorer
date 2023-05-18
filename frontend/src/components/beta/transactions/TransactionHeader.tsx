import * as React from "react";

import { useTranslation } from "next-i18next";

import { Transaction } from "@/common/types/procedures";
import StringConditionalOverlay from "@/frontend/components/beta/common/StringConditionalOverlay";
import UtcLabel from "@/frontend/components/beta/common/UtcLabel";
import TransactionStatus from "@/frontend/components/beta/transactions/TransactionStatus";
import CopyToClipboard from "@/frontend/components/utils/CopyToClipboard";
import { NearAmount } from "@/frontend/components/utils/NearAmount";
import { useDateFormat } from "@/frontend/hooks/use-date-format";
import { shortenString } from "@/frontend/libraries/formatting";
import { styled } from "@/frontend/libraries/styles";

type Props = {
  transaction: Transaction;
};

const AVATAR_SIZE = 26;
const AVATAR_MARGIN = 8;

const Wrapper = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  backgroundColor: "#000",
  padding: 28,
  borderRadius: 8,

  "@media (max-width: 1000px)": {
    flexDirection: "column",
  },
});

const BaseInfo = styled("div", {
  display: "flex",

  "@media (max-width: 1000px)": {
    marginBottom: 24,
  },
});

const CenteredContainer = styled("div", {
  display: "flex",
  alignItems: "center",
});

const Author = styled(CenteredContainer, {
  color: "#fff",
  fontWeight: 700,
  fontSize: 30,
  lineHeight: "150%",
});

const Divider = styled("img", {
  width: 17,
  marginHorizontal: 20,
});

const TransactionHash = styled("h1", {
  fontSize: 18,
  fontWeight: 400,
  color: "#fff",
  lineHeight: "21px",
  marginRight: 14,
  marginLeft: AVATAR_SIZE + AVATAR_MARGIN,
  marginBottom: 0,

  "@media (max-width: 1000px)": {
    marginLeft: 0,
  },
});

const TransactionCopy = styled("span", {
  marginLeft: ".5em",
});

const BaseInfoDetails = styled(CenteredContainer, {
  marginTop: 24,
});

const NumericDivider = styled("div", {
  height: "100%",
  width: 1,
  marginHorizontal: 20,
});

const AmountHeader = styled("div", {
  fontSize: 12,
  color: "#c9c9c9",
  lineHeight: "14px",
});

const Amount = styled("div", {
  fontWeight: 500,
  fontSize: 20,
  color: "#fff",
  marginTop: 16,
});

const TransactionHeader: React.FC<Props> = React.memo(({ transaction }) => {
  const { t } = useTranslation();
  const format = useDateFormat();
  return (
    <Wrapper>
      <BaseInfo>
        <div>
          <CenteredContainer>
            <StringConditionalOverlay
              tooltipId="accountId"
              value={transaction.signerId}
            >
              <Author>
                <span>{shortenString(transaction.signerId)}</span>
              </Author>
            </StringConditionalOverlay>
            <Divider src="/static/images/icon-from-arrow-right.svg" />
            <StringConditionalOverlay
              tooltipId="accountId"
              value={transaction.receiverId}
            >
              <Author>
                <span>{shortenString(transaction.receiverId)}</span>
              </Author>
            </StringConditionalOverlay>
          </CenteredContainer>
          <BaseInfoDetails>
            <TransactionHash>
              {shortenString(transaction.hash)}
              <TransactionCopy>
                <CopyToClipboard text={transaction.hash} />
              </TransactionCopy>
            </TransactionHash>
            <TransactionStatus status={transaction.status} />
          </BaseInfoDetails>
        </div>
      </BaseInfo>
      <CenteredContainer>
        <div>
          <AmountHeader>{t("pages.transaction.header.amount")}</AmountHeader>
          <Amount>
            <NearAmount amount={transaction.amount} decimalPlaces={2} />
          </Amount>
        </div>
        <NumericDivider />
        <div>
          <AmountHeader>{t("pages.transaction.header.fee")}</AmountHeader>
          <Amount>
            <NearAmount amount={transaction.fee} decimalPlaces={2} />
          </Amount>
        </div>
        <NumericDivider />
        <div>
          <AmountHeader>{t("pages.transaction.header.when")}</AmountHeader>
          <Amount>
            <CenteredContainer>
              {format(
                transaction.timestamp,
                t("common.date_time.transaction_date_format"),
                { utc: true }
              )}
              <UtcLabel />
              <CopyToClipboard
                css={{ marginLeft: 8 }}
                text={String(transaction.timestamp)}
              />
            </CenteredContainer>
          </Amount>
        </div>
      </CenteredContainer>
    </Wrapper>
  );
});

export default TransactionHeader;
