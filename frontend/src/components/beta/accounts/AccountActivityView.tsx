import * as React from "react";
import JSBI from "jsbi";
import { useTranslation } from "react-i18next";
import { styled } from "../../../libraries/styles";
import AccountActivityBadge from "./AccountActivityBadge";
import { shortenString } from "../../../libraries/formatting";
import {
  AccountActivityElementAction,
  AccountActivityElement,
  AccountActivityAction,
  AccountActivityRelatedAction,
  AccountActivity,
} from "../../../types/common";
import { NearAmount } from "../../utils/NearAmount";
import ListHandler from "../../utils/ListHandler";
import * as BI from "../../../libraries/bigint";
import Link from "../../utils/Link";
import CopyToClipboard from "../../utils/CopyToClipboard";
import { trpc } from "../../../libraries/trpc";
import { useDateFormat } from "../../../hooks/use-date-format";

const ACCOUNT_CHANGES_PER_PAGE = 20;

const TableWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  fontFamily: "Manrope",
  paddingHorizontal: 24,
  borderRadius: 8,
  border: "1px solid #e8e8e8",
  overflowX: "scroll",
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
  padding: 8,
});

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

const CopyWrapper = styled("div", {
  marginLeft: ".3em",
  fontSize: "1.5em",
});

const Badge = styled("div", {
  marginRight: 6,
  borderWidth: 1,
  borderRadius: 4,
  display: "inline-flex",
  borderStyle: "solid",
  minWidth: 24,
  justifyContent: "center",
});

const ActivityAccountName = styled("div", {
  display: "inline-flex",
});

type RowProps = {
  item: AccountActivityElement;
};

const getActionLink = (action: AccountActivityElementAction) => {
  return "blockHash" in action
    ? `/blocks/${action.blockHash}`
    : `/transactions/${action.transactionHash}${
        action.receiptId ? `#${action.receiptId}` : ""
      }`;
};

const getAccountLink = (account: string) => {
  return `/accounts/${account}`;
};

const ActivityItemActionWrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  whiteSpace: "pre",

  "& + &": {
    marginTop: 4,
  },
});

const ActivityItemTitle = styled("span", {
  fontWeight: "bold",
});

const ActivityItemAction: React.FC<{
  action: AccountActivityRelatedAction | AccountActivityAction;
}> = ({ action }) => {
  const badge = (
    <>
      {"sender" in action ? (
        <>
          <Link href={getAccountLink(action.sender)}>
            <a>{shortenString(action.sender)}</a>
          </Link>
          {" → "}
        </>
      ) : null}
      <AccountActivityBadge
        action={action}
        href={"transactionHash" in action ? getActionLink(action) : undefined}
      />
      {"receiver" in action ? (
        <>
          {" → "}
          <Link href={getAccountLink(action.receiver)}>
            <a>{shortenString(action.receiver)}</a>
          </Link>
        </>
      ) : null}
    </>
  );
  switch (action.kind) {
    case "transfer": {
      const deltaAmount = JSBI.BigInt(action.args.deposit);
      return (
        <ActivityItemActionWrapper>
          {badge}{" "}
          {JSBI.equal(deltaAmount, BI.zero) ? null : (
            <>
              {" 💸 "}
              <NearAmount amount={action.args.deposit} />
            </>
          )}
        </ActivityItemActionWrapper>
      );
    }
    case "stake": {
      const deltaAmount = JSBI.BigInt(action.args.stake);
      return (
        <ActivityItemActionWrapper>
          {badge}{" "}
          {JSBI.equal(deltaAmount, BI.zero) ? null : (
            <>
              {" 💸 "}
              <NearAmount amount={action.args.stake} />
            </>
          )}
        </ActivityItemActionWrapper>
      );
    }
    case "functionCall": {
      const attachedAmount = JSBI.BigInt(action.args.deposit);
      return (
        <ActivityItemActionWrapper>
          {badge}{" "}
          {JSBI.equal(attachedAmount, BI.zero) ? null : (
            <>
              {" 💸 "}
              <NearAmount amount={action.args.deposit} />
            </>
          )}
        </ActivityItemActionWrapper>
      );
    }
    default:
      return <ActivityItemActionWrapper>{badge}</ActivityItemActionWrapper>;
  }
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
    item.action.kind === "batch" ? item.action.actions : [item.action];
  const format = useDateFormat();

  return (
    <>
      {actions.map((subAction, subindex) => {
        const childrenActions = item.action.childrenActions ?? [];
        return (
          <TableRow key={subindex}>
            <TableElement>
              {subindex === 0 ? (
                <ActivityAccountName>
                  <Badge>{item.direction === "inbound" ? "in" : "out"}</Badge>
                  {item.involvedAccountId ? (
                    <Link href={getAccountLink(item.involvedAccountId)}>
                      <a>{shortenString(item.involvedAccountId)}</a>
                    </Link>
                  ) : (
                    "system"
                  )}
                </ActivityAccountName>
              ) : null}
            </TableElement>
            <TableElement>
              <ActivityItemAction action={subAction} />
              {item.action.parentAction ? (
                <>
                  <hr />
                  <ActivityItemTitle>Caused by receipt:</ActivityItemTitle>
                  <ActivityItemAction action={item.action.parentAction} />
                </>
              ) : null}
              {childrenActions.length !== 0 ? (
                <>
                  <hr />
                  <ActivityItemTitle>Children receipts:</ActivityItemTitle>
                  {childrenActions.map((childAction, index) => (
                    <ActivityItemAction key={index} action={childAction} />
                  ))}
                </>
              ) : null}
            </TableElement>
            <TableElement>
              {!isDeltaAmountZero && subindex === 0 ? (
                <Amount
                  direction={isDeltaAmountPositive ? "income" : "outcome"}
                >
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
                  <Link href={getActionLink(item.action)}>
                    {shortenString(
                      "blockHash" in item.action
                        ? item.action.blockHash
                        : item.action.transactionHash
                    )}
                  </Link>
                  <CopyWrapper>
                    <CopyToClipboard
                      text={
                        "blockHash" in item.action
                          ? item.action.blockHash
                          : item.action.transactionHash
                      }
                    />
                  </CopyWrapper>
                </>
              ) : null}
            </TableElement>
            <DateTableElement>
              {subindex === 0
                ? format(item.timestamp, t(`pages.account.activity.dateFormat`))
                : null}
            </DateTableElement>
          </TableRow>
        );
      })}
    </>
  );
};

type Props = {
  accountId: string;
};

const parser = (result: AccountActivity) => result.items;

const AccountActivityView: React.FC<Props> = ({ accountId }) => {
  const query = trpc.useInfiniteQuery(
    ["account.activity", { accountId, limit: ACCOUNT_CHANGES_PER_PAGE }],
    { getNextPageParam: (lastPage) => lastPage.cursor }
  );

  return (
    <>
      <ListHandler query={query} parser={parser}>
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
    </>
  );
};

export default AccountActivityView;
