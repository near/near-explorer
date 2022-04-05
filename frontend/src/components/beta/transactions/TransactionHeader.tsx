import BN from "bn.js";
import moment from "moment";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { formatBytes, formatNear } from "../../../libraries/formatting";
import { styled } from "../../../libraries/styles";

import CopyToClipboard from "../../beta/common/CopyToClipboard";
import TransactionExecutionStatus from "../../transactions/TransactionExecutionStatus";
import Gas from "../../utils/Gas";

type Props = {
  transaction: any;
};

const Wrapper = styled("div", {
  paddingVertical: "$space-l",
  // TODO: Place a proper padding here
  paddingHorizontal: 40,
  backgroundColor: "$background",
  display: "flex",
  justifyContent: "space-between",
  fontFamily: "Manrope",
});

const BaseInfo = styled("div", {
  display: "flex",
});

const Title = styled("div", {
  fontSize: 30,
  fontWeight: 600,
  lineHeight: "45px",
  color: "$textColor",
});

const TransactionHash = styled("div", {
  fontSize: 18,
  color: "$textColor",
  lineHeight: "27px",
  marginRight: 14,
});

const BaseInfoDetails = styled("div", {
  display: "flex",
  alignItems: "center",
  marginTop: "$space-s",
});

const NumericInfo = styled("div", {
  display: "flex",
  alignItems: "center",
});
const NumericDivider = styled("div", {
  height: "100%",
  width: 1,
  // backgroundColor: "$divider",
  marginHorizontal: "$space-l",
});

const AmountHeader = styled("div", {
  fontSize: "$font-s",
  color: "$backgroundTextColor",
});

const Amount = styled("div", {
  fontWeight: 500,
  fontSize: "$font-l",
  color: "$textColor",
  marginTop: "$space-m",
});

const Success = styled("div", {
  color: "$success",
  fontSize: "$font-m",
  fontWeight: 600,
  marginLeft: 14,
});

const SuccessIcon = styled("img", {
  marginLeft: 5,
  width: 11,
});

const TransactionHeader: React.FC<Props> = React.memo((props) => {
  const { t } = useTranslation();
  console.log("props", props);
  const hash = props.transaction.transaction.hash;

  return (
    <Wrapper>
      <BaseInfo>
        <div>
          <Title>{t("common.transactions.transaction")}</Title>
          <BaseInfoDetails>
            <TransactionHash>
              {`${hash.slice(0, 7)}...${hash.slice(-4)}`}
            </TransactionHash>
            <CopyToClipboard text={hash} />
            {props.transaction.status ? (
              <>
                <Success>
                  <TransactionExecutionStatus
                    status={props.transaction.status}
                  />
                </Success>
                <SuccessIcon src="/static/images/icon-success.svg" />
              </>
            ) : (
              t("common.blocks.status.fetching_status")
            )}
          </BaseInfoDetails>
        </div>
      </BaseInfo>
      <NumericInfo>
        <div>
          <AmountHeader>Fee</AmountHeader>
          <Amount>{formatNear(props.transaction.transactionFee)}</Amount>
        </div>
        <NumericDivider />
        <div>
          <AmountHeader>Attached</AmountHeader>
          <Amount>
            <Gas gas={new BN(props.transaction.gasAttached) || 0} />
          </Amount>
        </div>
        <NumericDivider />
        <div>
          <AmountHeader>Burned</AmountHeader>
          <Amount>
            <Gas gas={new BN(props.transaction.gasUsed) || 0} />
          </Amount>
        </div>
        <NumericDivider />
        <div>
          <AmountHeader>When</AmountHeader>
          <Amount>
            {moment(props.transaction.created.timestamp).format(
              "MM/DD/YYYY h:mm A"
            )}
          </Amount>
        </div>
      </NumericInfo>
    </Wrapper>
  );
});

export default TransactionHeader;
