import * as React from "react";
import JSBI from "jsbi";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { styled } from "../../../libraries/styles";
import AccountActivityBadge from "./AccountActivityBadge";
import { shortenString } from "../../../libraries/formatting";
import { AccountActivityElement } from "../../../types/common";
import { NearAmount } from "../../utils/NearAmount";
import ListHandler from "../../utils/ListHandler";
import * as BI from "../../../libraries/bigint";
import Link from "../../utils/Link";
import CopyToClipboard from "../common/CopyToClipboard";
import { trpc } from "../../../libraries/trpc";

const ACCOUNT_CHANGES_PER_PAGE = 20;

const TableWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  fontFamily: "Manrope",
  paddingHorizontal: 24,
  borderRadius: 8,
  border: "1px solid #e8e8e8",
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
});

const TableElement = styled("td");

const Amount = styled("div", {
  fontSize: 14,
  fontWeight: 500,

  variants: {
    direction: {
      income: {
        color: "#10AA7F",
      },
      outcome: {
        color: "#C65454",
      },
    },
  },
});

const DateTableElement = styled(TableElement, {
  color: "#9B9B9B",
});

const LinkPrefix = styled("span", { marginRight: 8 });

const copyToClipboardStyle = {
  marginLeft: ".3em",
  fontSize: "1.5em",
};

type RowProps = {
  item: AccountActivityElement;
};

const ActivityItemRow: React.FC<RowProps> = ({ item }) => {
  const { t } = useTranslation();
  const deltaAmount = JSBI.BigInt(item.deltaAmount);
  const isDeltaAmountZero = JSBI.equal(deltaAmount, BI.zero);
  const isDeltaAmountPositive = JSBI.greaterThan(deltaAmount, BI.zero);
  const absoluteDeltaAmount = isDeltaAmountPositive
    ? deltaAmount
    : JSBI.multiply(deltaAmount, BI.minusOne);
  const actions =
    item.action.type === "batch" ? item.action.actions : [item.action];
  const name = `${item.direction === "inbound" ? "<<<" : ">>>"} ${
    item.involvedAccountId ? shortenString(item.involvedAccountId) : "system"
  }`;
  return (
    <>
      {actions.map((subaction, subindex) => (
        <TableRow key={subindex}>
          <TableElement>{subindex === 0 ? name : null}</TableElement>
          <TableElement>
            <AccountActivityBadge action={subaction} />
          </TableElement>
          <TableElement>
            {!isDeltaAmountZero && subindex === 0 ? (
              <Amount direction={isDeltaAmountPositive ? "income" : "outcome"}>
                {isDeltaAmountPositive ? "+" : "-"}
                <NearAmount
                  amount={absoluteDeltaAmount.toString()}
                  decimalPlaces={2}
                />
              </Amount>
            ) : (
              "—"
            )}
          </TableElement>
          <TableElement>
            {subindex === 0 ? (
              <>
                <LinkPrefix>
                  {"transactionHash" in item.action
                    ? item.action.receiptId
                      ? "RX"
                      : "TX"
                    : "BL"}
                </LinkPrefix>
                <Link
                  href={
                    "transactionHash" in item.action
                      ? `/transactions/${item.action.transactionHash}${
                          item.action.receiptId
                            ? `#${item.action.receiptId}`
                            : ""
                        }`
                      : `/blocks/${item.action.blockHash}`
                  }
                >
                  {shortenString(
                    "transactionHash" in item.action
                      ? item.action.transactionHash
                      : item.action.blockHash
                  )}
                </Link>
                <CopyToClipboard
                  text={
                    "transactionHash" in item.action
                      ? item.action.transactionHash
                      : item.action.blockHash
                  }
                  css={copyToClipboardStyle}
                />
              </>
            ) : null}
          </TableElement>
          <DateTableElement>
            {subindex === 0
              ? moment
                  .utc(item.timestamp)
                  .format(t(`pages.account.activity.dateFormat`))
              : null}
          </DateTableElement>
        </TableRow>
      ))}
    </>
  );
};

type Props = {
  accountId: string;
};

const AccountActivityView: React.FC<Props> = ({ accountId }) => {
  const query = trpc.useInfiniteQuery(
    ["account-activity", { accountId, limit: ACCOUNT_CHANGES_PER_PAGE }],
    {
      getNextPageParam: (lastPage) => {
        const lastElement = lastPage[lastPage.length - 1];
        if (!lastElement) {
          return;
        }
        return lastElement.cursor;
      },
    }
  );

  return (
    <ListHandler query={query}>
      {(items) => {
        if (query.isLoading && items.length === 0) {
          return <div>Loading..</div>;
        }
        return (
          <TableWrapper>
            <table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Sender / Reciever</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Id</TableHeaderCell>
                  <TableHeaderCell>When</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {items.length === 0 ? "No activity" : null}
                {items.map((item, index) => (
                  <ActivityItemRow key={index} item={item} />
                ))}
              </tbody>
            </table>
          </TableWrapper>
        );
      }}
    </ListHandler>
  );
};

export default AccountActivityView;
