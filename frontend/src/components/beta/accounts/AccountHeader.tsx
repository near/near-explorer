import JSBI from "jsbi";
import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  BasicDecimalPower,
  BASIC_DENOMINATION,
  formatBytes,
  formatToPowerOfTen,
  shortenString,
} from "../../../libraries/formatting";
import { styled } from "../../../libraries/styles";
import { Account } from "../../../types/common";
import { NearAmount } from "../../utils/NearAmount";
import CopyToClipboard from "../common/CopyToClipboard";
import * as BI from "../../../libraries/bigint";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Timer from "../../utils/Timer";

type Props = {
  account: Account;
};

const Wrapper = styled("div", {
  padding: 28,
  borderRadius: 8,
  backgroundColor: "#000",
  display: "flex",
  justifyContent: "space-between",

  "@media (max-width: 1000px)": {
    flexDirection: "column",
  },
});

const BaseInfo = styled("div", {
  display: "flex",
  marginRight: 48,

  "@media (max-width: 1000px)": {
    marginRight: 0,
    marginBottom: 48,
  },
});

const Avatar = styled("div", {
  size: 60,
  backgroundColor: "#c4c4c4",
  opacity: 0.2,
  borderRadius: "50%",
  marginRight: 16,
  flexShrink: 0,
});

const AccountId = styled("h1", {
  fontSize: 36,
  fontWeight: 700,
  fontFamily: "Manrope",
  color: "#ffffff",
});

const AccountCopy = styled("span", {
  marginLeft: 16,
});

const BaseInfoDetails = styled("div", {
  display: "flex",
  alignItems: "center",
  marginTop: 8,
});

const InfoLineGap = styled("div", {
  marginLeft: 32,
});

const InfoLine = styled("span", {
  color: "#c9c9c9",
  fontSize: 12,
});

const CreatedBy = styled(InfoLine, {
  textDecoration: "underline",
});

const NumericDivider = styled("div", {
  marginHorizontal: 16,
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
  whiteSpace: "nowrap",
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
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="accountId">{props.account.id}</Tooltip>}
          >
            <AccountId>
              {shortenString(props.account.id)}
              <AccountCopy>
                <CopyToClipboard text={props.account.id} />
              </AccountCopy>
            </AccountId>
          </OverlayTrigger>
          <BaseInfoDetails>
            <CreatedBy
              as={props.account.created ? "a" : undefined}
              href={
                props.account.created
                  ? `/transactions/${props.account.created.hash}`
                  : undefined
              }
            >
              {props.account.created ? (
                <Trans
                  i18nKey="pages.account.header.createdAt"
                  t={t}
                  components={{
                    Timer: <Timer time={props.account.created.timestamp} />,
                  }}
                />
              ) : (
                t("common.terms.genesis")
              )}
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
