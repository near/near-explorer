import BN from "bn.js";

import { FC } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { utils } from "near-api-js";

import { showInYocto, formatWithCommas } from "../utils/Balance";
import { InfoCard, InfoCardCell as Cell } from "../utils/InfoCard";
import NearBadge from "./NearBadge";

const NodeBalance = ({
  amount,
  type,
}: {
  amount: BN;
  type: "totalSupply" | "totalStakeAmount" | "seatPriceAmount";
}) => {
  if (!amount) return null;
  let value;
  let suffix;
  if (type === "totalSupply") {
    value = formatWithCommas(
      (amount.div(utils.format.NEAR_NOMINATION).toNumber() / 10 ** 6).toFixed(1)
    );
    suffix = "M";
  } else if (type === "totalStakeAmount") {
    value = formatWithCommas(
      (amount.div(utils.format.NEAR_NOMINATION).toNumber() / 10 ** 6).toFixed(1)
    );
    suffix = "M";
  } else if (type === "seatPriceAmount") {
    value = formatWithCommas(
      amount.div(utils.format.NEAR_NOMINATION).toNumber().toFixed(0)
    );
  } else {
    value = amount;
  }

  const amountPrecise = showInYocto(amount.toString());
  return (
    <OverlayTrigger
      placement={"bottom"}
      overlay={<Tooltip id={type}>{amountPrecise}</Tooltip>}
    >
      <span className="node-balance-text">
        {value}
        {suffix && <span className="node-balance-suffix">{suffix}</span>}
        &nbsp;
        <NearBadge />
      </span>
    </OverlayTrigger>
  );
};

interface Props {
  currentValidatorsCount?: number;
  totalSupply?: string;
  totalStake?: string;
  seatPrice?: string;
}

const NodesCard: FC<Props> = ({
  currentValidatorsCount,
  totalSupply,
  totalStake,
  seatPrice,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <InfoCard className="nodes-card">
        <Cell
          title={t("component.nodes.NodesCard.nodes_validating")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
        >
          {currentValidatorsCount !== undefined && (
            <span className="validating">{currentValidatorsCount}</span>
          )}
        </Cell>

        <Cell
          title={t("component.nodes.NodesCard.total_supply")}
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {totalSupply && (
            <NodeBalance amount={new BN(totalSupply)} type="totalSupply" />
          )}
        </Cell>

        <Cell
          title={t("component.nodes.NodesCard.total_stake")}
          cellOptions={{ xs: "12", md: "6", xl: "3" }}
        >
          {totalStake && (
            <NodeBalance amount={new BN(totalStake)} type="totalStakeAmount" />
          )}
        </Cell>

        <Cell
          title={t("component.nodes.NodesCard.seat_price")}
          cellOptions={{ xs: "12", md: "6", xl: "4" }}
        >
          {seatPrice && (
            <NodeBalance amount={new BN(seatPrice)} type="seatPriceAmount" />
          )}
        </Cell>
      </InfoCard>
      <style jsx global>{`
        .nodes-card {
          background: #ffffff;
          border: 1px solid #f0f0f1;
          box-shadow: 0px 2px 2px rgba(17, 22, 24, 0.04);
          border-radius: 8px;
          padding: 48px 32px;
          margin-top: 50px;
        }

        .validating {
          color: #00c08b;
        }

        .node-balance-text {
          display: flex;
          align-items: center;
        }

        .node-balance-suffix {
          font-size: 25px;
          line-height: 35px;
          align-self: flex-end;
        }

        @media (max-width: 768px) {
          .nodes-card {
            margin-top: 32px;
            padding: 8px 16px 16px;
          }

          .nodes-card .info-card-text {
            font-size: 20px;
          }
          .node-balance-suffix {
            font-size: 14px;
            line-height: 22px;
          }
        }
        @media (max-width: 355px) {
          .nodes-card .info-card-text {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default NodesCard;
