import { Context } from "../context";
import * as tasks from "./tasks";

const regularTasks = [
  tasks.chainBlockStatsCheck,
  tasks.recentTransactionsCountCheck,
  tasks.transactionCountHistoryCheck,
  tasks.statsAggregationCheck,
  tasks.finalityStatusCheck,
  tasks.networkInfoCheck,
  tasks.stakingPoolMetadataInfoCheck,
  tasks.poolIdsCheck,
];

export const runTasks = (context: Context) => {
  const timeouts: Record<string, NodeJS.Timeout> = {};
  for (const task of regularTasks) {
    if (task.shouldSkip?.()) {
      continue;
    }

    const runTask = async () => {
      try {
        await task.fn(context.publishWamp, context);
      } catch (error) {
        console.warn(
          `Regular ${task.description} crashed due to:`,
          String(error)
        );
      } finally {
        setTimeoutBound();
      }
    };
    const setTimeoutBound = () => {
      timeouts[task.description] = setTimeout(runTask, task.interval);
    };
    void runTask();
  }
  return () => {
    const timeoutIds = Object.values(timeouts);
    timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
  };
};
