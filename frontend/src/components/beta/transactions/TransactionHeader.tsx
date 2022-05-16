import moment from "moment";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";

import CopyToClipboard from "../../beta/common/CopyToClipboard";
import { NearAmount } from "../../utils/NearAmount";
import TransactionStatus from "./TransactionStatus";

type Props = {
  transaction: any;
};

const Wrapper = styled("div", {
  backgroundColor: "#1b1d1f",
});

const Content = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: 1161,
  margin: "auto",
  padding: 40,
  fontFamily: "Manrope",
});

const BaseInfo = styled("div", {
  display: "flex",
});

const Title = styled("div", {
  fontSize: 30,
  fontWeight: 600,
  lineHeight: "45px",
  color: "#fff",
});

const TransactionHash = styled("div", {
  fontSize: 18,
  color: "#fff",
  lineHeight: "27px",
  marginRight: 14,
});

const BaseInfoDetails = styled("div", {
  display: "flex",
  alignItems: "center",
  marginTop: 8,
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

const TransactionHeader: React.FC<Props> = React.memo((props) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Content>
        <BaseInfo>
          <div>
            <Title>{t("common.transactions.transaction")}</Title>
            <BaseInfoDetails>
              <TransactionHash>
                {`${props.transaction.hash.slice(
                  0,
                  7
                )}...${props.transaction.hash.slice(-4)}`}
              </TransactionHash>
              <CopyToClipboard text={props.transaction.hash} />
              <TransactionStatus status={props.transaction.status} />
            </BaseInfoDetails>
          </div>
        </BaseInfo>
        <NumericInfo>
          <div>
            <AmountHeader>{t("pages.transaction.header.fee")}</AmountHeader>
            <Amount>
              <NearAmount
                amount={props.transaction.transactionFee}
                decimalPlaces={2}
              />
            </Amount>
          </div>
          <NumericDivider />
          <div>
            <AmountHeader>{t("pages.transaction.header.when")}</AmountHeader>
            <Amount>
              {moment(props.transaction.created.timestamp).format(
                t("pages.transaction.dateFormat")
              )}
            </Amount>
          </div>
        </NumericInfo>
      </Content>
    </Wrapper>
  );
});

export default TransactionHeader;
