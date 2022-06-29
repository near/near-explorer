import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../context";
import * as stats from "../providers/stats";

export const router = trpc
  .router<Context>()
  .query("get-latest-circulating-supply", {
    resolve: () => {
      return stats.getLatestCirculatingSupply();
    },
  })
  .query("new-accounts-count-aggregated-by-date", {
    resolve: () => {
      return stats.getNewAccountsCountByDate();
    },
  })
  .query("live-accounts-count-aggregated-by-date", {
    resolve: () => {
      return stats.getLiveAccountsCountByDate();
    },
  })
  .query("active-accounts-count-aggregated-by-week", {
    resolve: () => {
      return stats.getActiveAccountsCountByWeek();
    },
  })
  .query("active-accounts-count-aggregated-by-date", {
    resolve: () => {
      return stats.getActiveAccountsCountByDate();
    },
  })
  .query("active-accounts-list", {
    resolve: () => {
      return stats.getActiveAccountsList();
    },
  })
  .query("new-contracts-count-aggregated-by-date", {
    resolve: () => {
      return stats.getNewContractsCountByDate();
    },
  })
  .query("unique-deployed-contracts-count-aggregate-by-date", {
    resolve: () => {
      return stats.getUniqueDeployedContractsCountByDate();
    },
  })
  .query("active-contracts-count-aggregated-by-date", {
    resolve: () => {
      return stats.getActiveContractsCountByDate();
    },
  })
  .query("active-contracts-list", {
    resolve: () => {
      return stats.getActiveContractsList();
    },
  })
  .query("nearcore-total-fee-count", {
    input: z.tuple([z.number().min(1).max(7)]),
    resolve: ({ input: [daysCount] }) => {
      return stats.getTotalFee(daysCount);
    },
  });
