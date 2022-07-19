import * as React from "react";
import JSBI from "jsbi";
import { shortenString } from "../../../libraries/formatting";

import { styled } from "../../../libraries/styles";
import {
  AccountFungibleToken,
  AccountFungibleTokenHistoryElement,
} from "../../../types/common";
import { trpc } from "../../../libraries/trpc";
import { useDateFormat } from "../../../hooks/use-date-format";
import { useTranslation } from "react-i18next";
import { TokenAmount } from "../../utils/TokenAmount";
import LinkWrapper from "../../utils/Link";
import { buildAccountUrl } from "../../../hooks/use-account-page-options";

const TableWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  fontFamily: "Manrope",
  paddingHorizontal: 24,
  borderRadius: 8,
  border: "1px solid #e8e8e8",
  marginLeft: 20,
  flex: 2,

  "@media (max-width: 768px)": {
    marginLeft: 0,
    marginTop: 20,
  },
});

const TableHeader = styled("thead", {
  textTransform: "uppercase",
  color: "#c4c4c4",
  borderBottom: "1px solid #e8e8e8",

  fontSize: 12,
  fontWeight: 600,
});

const TableHeaderCell = styled("th", {
  paddingVertical: 20,
});

const TableRow = styled("tr", {
  fontSize: 14,
  fontWeight: 500,
  height: 50,

  "& + &": {
    borderTop: "1px solid #e8e8e8",
  },
});

const TableElement = styled("td", {
  verticalAlign: "top",
  paddingVertical: 8,
  paddingRight: 12,
});

const Link = styled(LinkWrapper, {
  cursor: "pointer",

  variants: {
    disabled: {
      true: {
        cursor: "inherit",
      },
    },
  },
});

type ItemProps = {
  item: AccountFungibleTokenHistoryElement;
  balance: string;
  token: AccountFungibleToken;
};

const AccountFungibleTokenHistoryElementView: React.FC<ItemProps> = React.memo(
  ({ item, token, balance }) => {
    const { t } = useTranslation();
    const format = useDateFormat();
    return (
      <TableRow>
        <Link
          href={
            item.counterparty
              ? buildAccountUrl({
                  accountId: item.counterparty,
                  tab: "fungible-tokens",
                })
              : ""
          }
          shallow
          disabled={!item.counterparty}
        >
          <TableElement>
            {item.counterparty
              ? shortenString(item.counterparty)
              : item.direction === "in"
              ? "MINT"
              : "BURN"}
          </TableElement>
        </Link>
        <TableElement>
          <TokenAmount
            token={{
              ...token,
              balance: (item.direction === "in" ? "" : "-") + item.amount,
            }}
            prefix={item.direction === "in" ? "+" : undefined}
            noSymbol
          />
        </TableElement>
        <TableElement>
          <TokenAmount token={{ ...token, balance }} noSymbol />
        </TableElement>
        <Link
          href={`/transactions/${item.transactionHash}#${item.receiptId}`}
          shallow
        >
          <TableElement>{shortenString(item.receiptId)}</TableElement>
        </Link>
        <TableElement>
          {format(item.timestamp, t("common.date_time.date_format"))}
        </TableElement>
      </TableRow>
    );
  }
);

type Props = {
  accountId: string;
  token: AccountFungibleToken;
};

const AccountFungibleTokenHistory: React.FC<Props> = React.memo(
  ({ accountId, token }) => {
    const tokenHistoryQuery = trpc.useQuery([
      "account.fungibleTokenHistory",
      { accountId, tokenAuthorAccountId: token.authorAccountId },
    ]);
    if (tokenHistoryQuery.status !== "success") {
      if (tokenHistoryQuery.status === "loading") {
        return <div>loading..</div>;
      }
      return null;
    }
    const { elements, baseAmount } = tokenHistoryQuery.data;
    const cumulativeBalance = elements
      .reduceRight<JSBI[]>(
        (acc, element) => [
          ...acc,
          element.direction === "in"
            ? JSBI.add(acc[acc.length - 1], JSBI.BigInt(element.amount))
            : JSBI.subtract(acc[acc.length - 1], JSBI.BigInt(element.amount)),
        ],
        [JSBI.BigInt(baseAmount)]
      )
      .slice(1)
      .reverse();
    return (
      <TableWrapper>
        <table>
          <TableHeader>
            <tr>
              <TableHeaderCell>Sender / Reciever</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>New Balance</TableHeaderCell>
              <TableHeaderCell>Id</TableHeaderCell>
              <TableHeaderCell>When</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {elements.length === 0 ? "No history" : null}
            {elements.map((item, index) => (
              <AccountFungibleTokenHistoryElementView
                key={`${item.transactionHash}#${item.receiptId}`}
                item={item}
                balance={cumulativeBalance[index].toString()}
                token={token}
              />
            ))}
          </tbody>
        </table>
      </TableWrapper>
    );
  }
);

export default AccountFungibleTokenHistory;
