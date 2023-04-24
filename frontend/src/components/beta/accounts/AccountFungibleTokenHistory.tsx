import * as React from "react";

import JSBI from "jsbi";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Spinner } from "react-bootstrap";

import {
  AccountFungibleToken,
  AccountFungibleTokenHistoryElement,
} from "@explorer/common/types/procedures";
import CopyToClipboard from "@explorer/frontend/components/utils/CopyToClipboard";
import LinkWrapper from "@explorer/frontend/components/utils/Link";
import { TokenAmount } from "@explorer/frontend/components/utils/TokenAmount";
import { buildAccountUrl } from "@explorer/frontend/hooks/use-account-page-options";
import { useDateFormat } from "@explorer/frontend/hooks/use-date-format";
import { shortenString } from "@explorer/frontend/libraries/formatting";
import { styled } from "@explorer/frontend/libraries/styles";
import { trpc } from "@explorer/frontend/libraries/trpc";

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

type ItemProps = {
  item: AccountFungibleTokenHistoryElement;
  balance: string;
  token: AccountFungibleToken;
};

const AccountFungibleTokenHistoryElementView: React.FC<ItemProps> = React.memo(
  ({ item, token, balance }) => {
    const { t } = useTranslation();
    const format = useDateFormat();
    const router = useRouter();
    return (
      <TableRow>
        <LinkWrapper
          href={
            item.counterparty
              ? buildAccountUrl({
                  usePrefix: router.pathname.startsWith("/beta"),
                  accountId: item.counterparty,
                  tab: "fungible-tokens",
                })
              : undefined
          }
        >
          <TableElement>
            {item.counterparty
              ? shortenString(item.counterparty)
              : item.direction === "in"
              ? "MINT"
              : "BURN"}
          </TableElement>
        </LinkWrapper>
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
        <LinkWrapper
          href={`/transactions/${item.transactionHash}#${item.receiptId}`}
        >
          <TableElement>{shortenString(item.receiptId)}</TableElement>
        </LinkWrapper>
        <TableElement>
          {format(item.timestamp, t("common.date_time.date_format"))}
          <CopyToClipboard
            css={{ marginLeft: 8 }}
            text={String(item.timestamp)}
          />
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
        return <Spinner animation="border" />;
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
