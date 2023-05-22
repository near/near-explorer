import * as React from "react";

import JSBI from "jsbi";
import { useTranslation } from "next-i18next";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import NearBadge from "@/frontend/components/nodes/NearBadge";
import { getTotalStake } from "@/frontend/components/nodes/ValidatorsList";
import {
  showInYocto,
  formatWithCommas,
} from "@/frontend/components/utils/Balance";
import {
  InfoCard,
  InfoCardCell as Cell,
  InfoCardText,
} from "@/frontend/components/utils/InfoCard";
import { subscriptions } from "@/frontend/hooks/use-subscription";
import * as BI from "@/frontend/libraries/bigint";
import { styled } from "@/frontend/libraries/styles";

const NodesCardWrapper = styled(InfoCard, {
  background: "#ffffff",
  border: "1px solid #f0f0f1",
  boxShadow: "0px 2px 2px rgba(17, 22, 24, 0.04)",
  borderRadius: 8,
  padding: "48px 32px",
  marginTop: 50,

  "@media (max-width: 768px)": {
    marginTop: 32,
    padding: "8px 16px 16px",
    [`& ${InfoCardText}`]: {
      fontSize: 20,
    },
  },

  "@media (max-width: 355px)": {
    [`& ${InfoCardText}`]: {
      fontSize: 14,
    },
  },
});

const Validating = styled("span", {
  color: "#00c08b",
});

const NodeBalanceText = styled("span", {
  display: "flex",
  alignItems: "center",
});

const NodeBalanceSuffix = styled("span", {
  fontSize: 25,
  lineHeight: "35px",
  alignSelf: "flex-end",

  "@media (max-width: 768px)": {
    fontSize: 14,
    lineHeight: "22px",
  },
});

type BalanceProps = {
  amount: JSBI;
  type: "totalSupply" | "totalStakeAmount" | "seatPriceAmount";
};

const NodeBalance: React.FC<BalanceProps> = React.memo(({ amount, type }) => {
  if (!amount) return null;
  let value;
  let suffix;
  const amountInNear = JSBI.toNumber(JSBI.divide(amount, BI.nearNomination));
  if (type === "totalSupply") {
    value = formatWithCommas((amountInNear / 10 ** 6).toFixed(1));
    suffix = "M";
  } else if (type === "totalStakeAmount") {
    value = formatWithCommas((amountInNear / 10 ** 6).toFixed(1));
    suffix = "M";
  } else if (type === "seatPriceAmount") {
    value = formatWithCommas(amountInNear.toFixed(0));
  } else {
    value = amount;
  }

  const amountPrecise = showInYocto(amount.toString());
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id={type}>{amountPrecise}</Tooltip>}
    >
      <NodeBalanceText>
        {value}
        {suffix && <NodeBalanceSuffix>{suffix}</NodeBalanceSuffix>}
        &nbsp;
        <NearBadge />
      </NodeBalanceText>
    </OverlayTrigger>
  );
});

const NodesCard = React.memo(() => {
  const { t } = useTranslation();
  const epochStatsSub = subscriptions.epochStats.useSubscription();
  const epochStartBlockSub = subscriptions.epochStartBlock.useSubscription();
  const currentValidatorsCountSub =
    subscriptions.currentValidatorsCount.useSubscription();
  const validatorsSub = subscriptions.validators.useSubscription();
  const totalStake = React.useMemo(
    () => (validatorsSub.data ? getTotalStake(validatorsSub.data) : undefined),
    [validatorsSub.data]
  );
  return (
    <NodesCardWrapper>
      <Cell
        title={t("component.nodes.NodesCard.nodes_validating")}
        cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
      >
        {currentValidatorsCountSub.data !== undefined && (
          <Validating>{currentValidatorsCountSub.data}</Validating>
        )}
      </Cell>

      <Cell
        title={t("component.nodes.NodesCard.total_supply")}
        cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
      >
        {epochStartBlockSub.status === "success" && (
          <NodeBalance
            amount={JSBI.BigInt(epochStartBlockSub.data.totalSupply)}
            type="totalSupply"
          />
        )}
      </Cell>

      <Cell
        title={t("component.nodes.NodesCard.total_stake")}
        cellOptions={{ xs: "12", md: "6", xl: "3" }}
      >
        {totalStake && (
          <NodeBalance amount={totalStake} type="totalStakeAmount" />
        )}
      </Cell>

      <Cell
        title={t("component.nodes.NodesCard.seat_price")}
        cellOptions={{ xs: "12", md: "6", xl: "4" }}
      >
        {epochStatsSub.status === "success" && (
          <NodeBalance
            amount={JSBI.BigInt(epochStatsSub.data.seatPrice)}
            type="seatPriceAmount"
          />
        )}
      </Cell>
    </NodesCardWrapper>
  );
});

export default NodesCard;
