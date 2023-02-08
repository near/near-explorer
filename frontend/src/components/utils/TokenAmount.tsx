import React from "react";

import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { AccountFungibleToken } from "@explorer/common/types/procedures";
import { formatToPowerOfTen } from "@explorer/frontend/libraries/formatting";
import { styled } from "@explorer/frontend/libraries/styles";

const Offsetted = styled("span", {
  marginLeft: "0.3em",
});

type Props = {
  token: AccountFungibleToken;
  prefix?: string;
  noSymbol?: boolean;
};

const TRAILING_ZEROES_REGEX = /(.*?)0+$/g;

const reverseString = (input: string) => input.split("").reverse().join("");
const formatBigInt = (input: string) =>
  reverseString(input)
    .split("")
    .reduce(
      (acc, char) => {
        const lastGroup = acc[acc.length - 1];
        if (lastGroup.length < 3) {
          return [...acc.slice(0, -1), lastGroup + char];
        }
        return [...acc, char];
      },
      [""]
    )
    .reverse()
    .map(reverseString)
    .join(" ");

export const TokenAmount: React.FC<Props> = (props) => {
  const formattedAmount = formatToPowerOfTen(
    props.token.balance,
    props.token.decimals / 3
  );
  const remainderNoZeroes = formattedAmount.remainder.replace(
    TRAILING_ZEROES_REGEX,
    "$1"
  );
  let remainder = Number(`0.${remainderNoZeroes}`)
    .toFixed(3)
    .slice(1)
    .replace(TRAILING_ZEROES_REGEX, "$1");
  if (remainder === ".") {
    remainder = "";
  }

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id="fungible-token">
          {`${props.prefix ?? ""}${formattedAmount.quotient}${
            remainderNoZeroes.length === 0 ? "" : `.${remainderNoZeroes}`
          } ${props.token.symbol}`}
        </Tooltip>
      }
    >
      <span>
        {props.prefix}
        {formatBigInt(formattedAmount.quotient)}
        {remainder}
        {props.noSymbol ? null : <Offsetted>{props.token.symbol}</Offsetted>}
      </span>
    </OverlayTrigger>
  );
};
