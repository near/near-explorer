import JSBI from "jsbi";
import moment from "moment";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  BasicDecimalPower,
  BASIC_DENOMINATION,
  formatBytes,
  formatToPowerOfTen,
} from "../../../libraries/formatting";
import { styled } from "../../../libraries/styles";
import { Account } from "../../../types/common";
import { NearAmount } from "../../utils/NearAmount";
import CopyToClipboard from "../common/CopyToClipboard";
import * as BI from "../../../libraries/bigint";

type Props = {
  account: Account;
};

const Wrapper = styled("div", {
  padding: 28,
  borderRadius: 8,
  backgroundColor: "#000",
  display: "flex",
  justifyContent: "space-between",
});

const BaseInfo = styled("div", {
  display: "flex",
});

const Avatar = styled("div", {
  size: 60,
  backgroundColor: "#c4c4c4",
  opacity: 0.2,
  borderRadius: "50%",
  marginRight: 16,
});

const AccountId = styled("h1", {
  fontSize: 36,
  fontWeight: 700,
  fontFamily: "Manrope",
  color: "#ffffff",
});

const AccountCopy = styled("span", {
  marginLeft: ".5em",
});

const BaseInfoDetails = styled("div", {
  display: "flex",
  alignItems: "center",
  marginTop: 8,
});

const InfoLineGap = styled("div", {
  marginLeft: 16,
});

const InfoLine = styled("span", {
  color: "#c9c9c9",
  fontSize: 12,
});

const CreatedBy = styled(InfoLine, {
  textDecoration: "underline",
});

const NumericDivider = styled("div", {
  marginHorizontal: 40,
});

const AccountTypeBadge = styled("div", {
  textTransform: "uppercase",
  fontSize: 10,
  fontWeight: 700,
  fontFamily: "Manrope",
  borderRadius: 4,
  padding: "4px 12px",

  variants: {
    type: {
      user: {
        backgroundColor: "#7578FB",
        color: "#ffffff",
      },
      contract: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "#ffffff",
      },
    },
  },
});

const NumericInfo = styled("div", {
  display: "flex",
  alignItems: "center",
});

const QuantityHeader = styled("div", {
  fontSize: 12,
  color: "#c9c9c9",
});

const Quantity = styled("div", {
  fontWeight: 500,
  fontSize: 24,
  color: "#ffffff",
  marginTop: 16,
});

const AccountHeader: React.FC<Props> = React.memo((props) => {
  const { t } = useTranslation();
  const transactionsQuantity = formatToPowerOfTen<BasicDecimalPower>(
    props.account.transactionsQuantity.toString(),
    6
  );
  return (
    <Wrapper>
      <BaseInfo>
        <Avatar />
        <div>
          <AccountId>
            {props.account.id}
            <AccountCopy>
              <CopyToClipboard text={props.account.id} />
            </AccountCopy>
          </AccountId>
          <BaseInfoDetails>
            <CreatedBy
              as={props.account.created ? "a" : undefined}
              href={
                props.account.created
                  ? `/transactions/${props.account.created.hash}`
                  : undefined
              }
            >
              {props.account.created
                ? t("pages.account.header.createdAt", {
                    fromNow: moment(props.account.created.timestamp).fromNow(),
                  })
                : t("common.terms.genesis")}
            </CreatedBy>
            <InfoLineGap />
            <InfoLine>
              {t("pages.account.header.storageUsed", {
                amount: formatBytes(props.account.storageUsed),
              })}
            </InfoLine>
            <InfoLineGap />
            <AccountTypeBadge
              type={props.account.isContract ? "contract" : "user"}
            >
              {props.account.isContract
                ? t("pages.account.header.accountType.contract")
                : t("pages.account.header.accountType.user")}
            </AccountTypeBadge>
          </BaseInfoDetails>
        </div>
      </BaseInfo>
      <NumericInfo>
        <div>
          <QuantityHeader>
            {t("pages.account.header.amounts.balance")}
          </QuantityHeader>
          <Quantity>
            <NearAmount
              amount={props.account.nonStakedBalance}
              decimalPlaces={2}
            />
          </Quantity>
        </div>
        <NumericDivider />
        {!JSBI.equal(JSBI.BigInt(props.account.stakedBalance), BI.zero) ? (
          <>
            <div>
              <QuantityHeader>
                {t("pages.account.header.amounts.staked")}
              </QuantityHeader>
              <Quantity>
                <NearAmount
                  amount={props.account.stakedBalance}
                  decimalPlaces={2}
                />
              </Quantity>
            </div>
            <NumericDivider />
          </>
        ) : null}
        <div>
          <QuantityHeader>
            {t("pages.account.header.amounts.transactions")}
          </QuantityHeader>
          <Quantity>{`${transactionsQuantity.quotient}${
            BASIC_DENOMINATION[transactionsQuantity.prefix]
          }`}</Quantity>
        </div>
      </NumericInfo>
    </Wrapper>
  );
});

export default AccountHeader;
