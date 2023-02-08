import React from "react";

import { OverlayTrigger, Tooltip } from "react-bootstrap";

import NearIcon from "@explorer/frontend/components/beta/common/NearIcon";
import {
  formatToPowerOfTen,
  NEAR_DENOMINATION,
  NearDecimalPower,
} from "@explorer/frontend/libraries/formatting";
import { styled } from "@explorer/frontend/libraries/styles";

const Offsetted = styled("span", {
  marginLeft: "0.3em",
});

type Props = {
  amount: string;
  decimalPlaces?: number;
};

export const NearAmount: React.FC<Props> = (props) => {
  let formattedAmount = formatToPowerOfTen<NearDecimalPower>(props.amount, 11);
  const tooltipValue =
    formattedAmount.prefix < 8
      ? `${formattedAmount.quotient}${formattedAmount.remainder} ${NEAR_DENOMINATION["0"]}`
      : undefined;
  if (formattedAmount.prefix < 3) {
    formattedAmount = {
      ...formattedAmount,
      quotient: formattedAmount.quotient + formattedAmount.remainder,
      remainder: "",
      prefix: 0,
    };
  } else if (formattedAmount.prefix < 8) {
    formattedAmount = {
      ...formattedAmount,
      quotient: Number(
        `0.${formattedAmount.quotient.padStart(3, "0")}`
      ).toPrecision(props.decimalPlaces ?? 3),
      prefix: 8,
    };
  }
  const content = (
    <span>
      {formattedAmount.quotient}
      {formattedAmount.remainder && !formattedAmount.quotient.includes(".")
        ? Number(`0.${formattedAmount.remainder}`)
            .toPrecision(props.decimalPlaces ?? 3)
            .slice(1)
        : ""}

      <Offsetted>
        {NEAR_DENOMINATION[formattedAmount.prefix]}
        <NearIcon />
      </Offsetted>
    </span>
  );
  if (!tooltipValue) {
    return content;
  }
  return (
    <OverlayTrigger
      overlay={
        <Tooltip id="near-amount">
          {tooltipValue}
          <NearIcon />
        </Tooltip>
      }
    >
      {content}
    </OverlayTrigger>
  );
};
