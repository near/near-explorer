import { Context } from "../context";
import {
  queryNewAccountsCountAggregatedByDate,
  queryDeletedAccountsCountAggregatedByDate,
  queryActiveAccountsCountAggregatedByDate,
  queryActiveAccountsCountAggregatedByWeek,
  queryActiveAccountsList,
} from "../database/queries";
import { formatDate } from "../utils/formatting";
import { trimError } from "../utils/logging";

type Nullable<T> = T | null;
type DatedStats<T> = (T & { date: string })[];

// accounts
let NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE: Nullable<
  DatedStats<{ accountsCount: number }>
> = null;
let DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE: Nullable<
  DatedStats<{ accountsCount: number }>
> = null;
let ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE: Nullable<
  DatedStats<{ accountsCount: number }>
> = null;
let ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK: Nullable<
  DatedStats<{ accountsCount: number }>
> = null;
let LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE: Nullable<
  DatedStats<{ accountsCount: number }>
> = null;
let ACTIVE_ACCOUNTS_LIST: Nullable<
  { account: string; transactionsCount: string }[]
> = null;

// This is a decorator that auto-retry failing function up to 5 times before giving up.
// If the wrapped function fails 5 times in a row, the result value is going to be undefined.
function retriable<Args extends unknown[]>(
  wrapped: (...args: Args) => Promise<void>,
  action: string
): (...args: Args) => Promise<void> {
  return async function (...args: Args) {
    for (let attempts = 1; ; ++attempts) {
      try {
        await wrapped(...args);
        return;
      } catch (error) {
        if (attempts >= 5) {
          console.warn(`ERROR: ${action} has failed after 5 attempts`);
          return;
        } else {
          console.warn(
            `WARNING: ${action} failed to execute ${attempts} times due to: ${trimError(
              error
            )}`
          );
        }
      }
    }
  };
}

// accounts
export const aggregateNewAccountsCountByDate = retriable(async () => {
  const newAccountsCountAggregatedByDate =
    await queryNewAccountsCountAggregatedByDate();
  NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = newAccountsCountAggregatedByDate.map(
    ({ date, new_accounts_count_by_date }) => ({
      date: formatDate(date),
      accountsCount: new_accounts_count_by_date,
    })
  );
}, "New accounts count time series");

export const aggregateDeletedAccountsCountByDate = retriable(async () => {
  const deletedAccountsCountAggregatedByDate =
    await queryDeletedAccountsCountAggregatedByDate();
  DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE =
    deletedAccountsCountAggregatedByDate.map(
      ({ date, deleted_accounts_count_by_date }) => ({
        date: formatDate(date),
        accountsCount: deleted_accounts_count_by_date,
      })
    );
}, "Deleted accounts count time series");

const generateDateArray = (
  startDate: string,
  endDate: Date = new Date()
): string[] => {
  for (
    var arr = [], dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(formatDate(new Date(dt)));
  }
  return arr;
};

const cumulativeAccountsCountArray = <T extends { accountsCount: number }>(
  array: T[]
): T[] => {
  return array.reduce((r, a) => {
    if (r.length > 0) a.accountsCount += r[r.length - 1].accountsCount;
    r.push(a);
    return r;
  }, Array());
};

export const aggregateLiveAccountsCountByDate = retriable(
  async (context: Context) => {
    if (!context.state.genesis) {
      return;
    }
    if (
      NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE &&
      DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE
    ) {
      const startDate = NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[0].date;
      const dateArray = generateDateArray(startDate);
      let changedAccountsCountByDate = dateArray.map((date) => ({
        date: date,
        accountsCount: 0,
      }));
      changedAccountsCountByDate[0].accountsCount = Number(
        context.state.genesis.accountCount
      );

      let newAccountMap = new Map<string, number>();
      for (let i = 0; i < NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE.length; i++) {
        newAccountMap.set(
          NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].date,
          Number(NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].accountsCount)
        );
      }

      let deletedAccountMap = new Map<string, number>();
      for (
        let i = 0;
        i < DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE.length;
        i++
      ) {
        deletedAccountMap.set(
          DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].date,
          Number(DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].accountsCount)
        );
      }

      for (let i = 0; i < changedAccountsCountByDate.length; i++) {
        const newAccountsCount = newAccountMap.get(
          changedAccountsCountByDate[i].date
        );
        if (newAccountsCount) {
          changedAccountsCountByDate[i].accountsCount += newAccountsCount;
        }
        const deletedAccountsCount = deletedAccountMap.get(
          changedAccountsCountByDate[i].date
        );
        if (deletedAccountsCount) {
          changedAccountsCountByDate[i].accountsCount -= deletedAccountsCount;
        }
      }
      LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE = cumulativeAccountsCountArray(
        changedAccountsCountByDate
      );
    }
  },
  "Live accounts count time series"
);

export const aggregateActiveAccountsCountByDate = retriable(async () => {
  const activeAccountsCountByDate =
    await queryActiveAccountsCountAggregatedByDate();
  ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = activeAccountsCountByDate.map(
    ({ date, active_accounts_count_by_date }) => ({
      date: formatDate(date),
      accountsCount: active_accounts_count_by_date,
    })
  );
}, "Top active accounts count time series");

export const aggregateActiveAccountsCountByWeek = retriable(async () => {
  const activeAccountsCountByWeek =
    await queryActiveAccountsCountAggregatedByWeek();
  ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK = activeAccountsCountByWeek.map(
    ({ date, active_accounts_count_by_week }) => ({
      date: formatDate(date),
      accountsCount: active_accounts_count_by_week,
    })
  );
}, "New accounts count time series weekly");

export const aggregateActiveAccountsList = retriable(async () => {
  const activeAccountsList = await queryActiveAccountsList();
  ACTIVE_ACCOUNTS_LIST = activeAccountsList
    .map(({ account_id: account, transactions_count: transactionsCount }) => ({
      account,
      transactionsCount: transactionsCount || "0",
    }))
    .reverse();
}, "Top active accounts with respective transactions count");

//accounts
export const getNewAccountsCountByDate = () => {
  return NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
};

export const getDeletedAccountCountBydate = () => {
  return DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
};

export const getActiveAccountsCountByDate = () => {
  return ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
};

export const getActiveAccountsCountByWeek = () => {
  return ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK;
};

export const getLiveAccountsCountByDate = () => {
  return LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE;
};

export const getActiveAccountsList = () => {
  return ACTIVE_ACCOUNTS_LIST;
};
