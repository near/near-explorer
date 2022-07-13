import * as trpc from "@trpc/server";

import { Context } from "../../context";
import * as stats from "../../providers/stats";

export const router = trpc
  .router<Context>()
  .query("newAccountsHistory", {
    resolve: () => {
      return stats.getNewAccountsCountByDate();
    },
  })
  .query("liveAccountsHistory", {
    resolve: () => {
      return stats.getLiveAccountsCountByDate();
    },
  })
  .query("activeAccountsByWeekHistory", {
    resolve: () => {
      return stats.getActiveAccountsCountByWeek();
    },
  })
  .query("activeAccountsByDayHistory", {
    resolve: () => {
      return stats.getActiveAccountsCountByDate();
    },
  })
  .query("topActiveAccounts", {
    resolve: () => {
      return stats.getActiveAccountsList();
    },
  });
