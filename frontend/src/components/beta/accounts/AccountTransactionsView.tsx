import * as React from "react";

import JSBI from "jsbi";
import { Trans } from "next-i18next";
import { Spinner } from "react-bootstrap";

import {
  TransactionListResponse,
  TransactionPreview,
  Action,
} from "@explorer/common/types/procedures";
import AccountActivityBadge from "@explorer/frontend/components/beta/accounts/AccountActivityBadge";
import AccountLink from "@explorer/frontend/components/beta/common/AccountLink";
import ShortenValue from "@explorer/frontend/components/beta/common/ShortenValue";
import Timestamp from "@explorer/frontend/components/beta/common/Timestamp";
import TransactionLink from "@explorer/frontend/components/beta/common/TransactionLink";
import ListHandler from "@explorer/frontend/components/utils/ListHandler";
import { NearAmount } from "@explorer/frontend/components/utils/NearAmount";
import { styled } from "@explorer/frontend/libraries/styles";
import { trpc } from "@explorer/frontend/libraries/trpc";

const TRANSACTIONS_PER_PAGE = 10;

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
  paddingHorizontal: 8,
});

const TableRow = styled("tr", {
  fontSize: 14,
  fontWeight: 500,
  height: 50,

  "& + &": {
    borderTop: "1px solid #e8e8e8",
  },

  variants: {
    noBorderTop: {
      true: {
        borderTop: "none !important",
      },
    },
  },
});

const Amount = styled("div", {
  display: "inline",
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

const ColoredAmount: React.FC<{
  deposit: JSBI;
  direction: "outcome" | "income";
}> = ({ deposit, direction }) => (
  <Amount direction={direction}>
    <NearAmount amount={deposit.toString()} decimalPlaces={2} />
  </Amount>
);

type RowProps = {
  item: TransactionPreview;
  accountId: string;
};

const ActivityItemAction: React.FC<{
  action: Action;
  receiverId: string;
  signerId: string;
  accountId: string;
}> = ({ action, receiverId, signerId, accountId }) => {
  switch (action.kind) {
    case "transfer": {
      if (signerId === accountId) {
        return (
          <Trans
            i18nKey="pages.account.transactions.functions.transfer.outcoming"
            components={{
              amount: (
                <ColoredAmount
                  deposit={JSBI.BigInt(action.args.deposit)}
                  direction="outcome"
                />
              ),
              receiverId: <AccountLink accountId={receiverId} />,
            }}
          />
        );
      }
      return (
        <Trans
          i18nKey="pages.account.transactions.functions.transfer.incoming"
          components={{
            amount: (
              <ColoredAmount
                deposit={JSBI.BigInt(action.args.deposit)}
                direction="income"
              />
            ),
            signerId: <AccountLink accountId={signerId} />,
          }}
        />
      );
    }
    case "stake": {
      return (
        <Trans
          i18nKey="pages.account.transactions.functions.stake"
          values={{ publicKey: action.args.publicKey }}
          components={{
            amount: <NearAmount amount={action.args.stake} />,
            shorten: <ShortenValue />,
          }}
        />
      );
    }
    case "functionCall": {
      return (
        <Trans
          i18nKey="pages.account.transactions.functions.functionCall"
          values={{ methodName: action.args.methodName }}
          components={{
            contract: <AccountLink accountId={receiverId} />,
          }}
        />
      );
    }
    case "addKey":
      if (action.args.accessKey.permission.type === "fullAccess") {
        return (
          <Trans
            i18nKey="pages.account.transactions.functions.addKey.fullAccess"
            values={{ publicKey: action.args.publicKey }}
            components={{
              contract: <AccountLink accountId={receiverId} />,
              shorten: <ShortenValue />,
            }}
          />
        );
      }
      return (
        <Trans
          i18nKey="pages.account.transactions.functions.addKey.partialAccess"
          values={{
            publicKey: action.args.publicKey,
          }}
          components={{
            contract: (
              <AccountLink
                accountId={action.args.accessKey.permission.contractId}
              />
            ),
            receiver: <AccountLink accountId={receiverId} />,
            shorten: <ShortenValue />,
          }}
        />
      );
    case "createAccount":
      return (
        <Trans
          i18nKey="pages.account.transactions.functions.createAccount"
          components={{
            account: <AccountLink accountId={receiverId} />,
          }}
        />
      );
    case "deleteAccount":
      return (
        <Trans
          i18nKey="pages.account.transactions.functions.deleteAccount"
          components={{
            account: <AccountLink accountId={receiverId} />,
            benefeciar: <AccountLink accountId={action.args.beneficiaryId} />,
          }}
        />
      );
    case "deleteKey":
      return (
        <Trans
          i18nKey="pages.account.transactions.functions.deleteKey"
          values={{ publicKey: action.args.publicKey }}
          components={{
            shorten: <ShortenValue />,
          }}
        />
      );
    case "deployContract":
      return (
        <Trans
          i18nKey="pages.account.transactions.functions.deployContract"
          components={{
            account: <AccountLink accountId={receiverId} />,
          }}
        />
      );
    default:
      return <>{JSON.stringify(action, null, 4)}</>;
  }
};

const OuterTableCell = styled("td", {
  verticalAlign: "top",
  padding: 8,

  variants: {
    color: {
      gray: {
        color: "#9B9B9B",
      },
    },
  },
});

const InnerTableCell = styled("span", {
  variants: {
    nowrap: {
      true: {
        whiteSpace: "nowrap",
      },
    },
  },
});

const TableCell: React.FC<
  React.PropsWithChildren<{ color?: "gray"; nowrap?: boolean }>
> = ({ children, color, nowrap }) => (
  <OuterTableCell color={color}>
    <InnerTableCell nowrap={nowrap}>{children}</InnerTableCell>
  </OuterTableCell>
);

const ActivityItemActionWrapper = styled("div", {
  display: "inline",
  alignItems: "center",
});

const ActivityItemRow: React.FC<RowProps> = ({ item, accountId }) => (
  <>
    {item.actions.map((subAction, subIndex) => (
      // eslint-disable-next-line react/no-array-index-key
      <TableRow key={`${item.hash}_${subIndex}`} noBorderTop={subIndex !== 0}>
        <TableCell>
          <AccountActivityBadge action={subAction} />
          <ActivityItemActionWrapper>
            <ActivityItemAction
              action={subAction}
              receiverId={item.receiverId}
              signerId={item.signerId}
              accountId={accountId}
            />
          </ActivityItemActionWrapper>
        </TableCell>
        <TableCell nowrap>
          {subIndex === 0 ? <TransactionLink hash={item.hash} /> : null}
        </TableCell>
        <TableCell>
          {subIndex === 0 ? (
            <Timestamp timestamp={item.blockTimestamp} />
          ) : null}
        </TableCell>
      </TableRow>
    ))}
  </>
);

type Props = {
  accountId: string;
};

const parser = (result: TransactionListResponse) => result.items;

const AccountTransactionsView = React.memo<React.FC<Props>>(({ accountId }) => {
  const query = trpc.useInfiniteQuery(
    [
      "transaction.listByAccountId",
      { accountId, limit: TRANSACTIONS_PER_PAGE },
    ],
    React.useMemo(
      () => ({ getNextPageParam: (lastPage) => lastPage.cursor }),
      []
    )
  );

  return (
    <ListHandler query={query} parser={parser}>
      {(items) => {
        if (query.isLoading && items.length === 0) {
          return <Spinner animation="border" />;
        }
        return (
          <TableWrapper>
            <table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Action</TableHeaderCell>
                  <TableHeaderCell>Transaction</TableHeaderCell>
                  <TableHeaderCell>When</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {items.length === 0 ? "No transactions" : null}
                {items.map((item) => (
                  <ActivityItemRow
                    key={item.hash}
                    item={item}
                    accountId={accountId}
                  />
                ))}
              </tbody>
            </table>
          </TableWrapper>
        );
      }}
    </ListHandler>
  );
});

export default AccountTransactionsView;
