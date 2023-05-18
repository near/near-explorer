import { Context } from "@explorer/backend/context";
import * as tasks from "@explorer/backend/cron/tasks";
import { PublishTopic } from "@explorer/backend/cron/types";
import { SECOND } from "@explorer/backend/utils/time";

const regularTasks = [
  tasks.latestBlockCheck,
  tasks.latestGasPriceCheck,
  tasks.blockProductionSpeedCheck,
  tasks.recentTransactionsCountCheck,
  tasks.onlineNodesCountCheck,
  tasks.genesisProtocolInfoFetch,
  tasks.transactionsHistoryCheck,
  tasks.gasUsedHistoryCheck,
  tasks.contractsHistoryCheck,
  tasks.activeContractsHistoryCheck,
  tasks.activeContractsListCheck,
  tasks.accountsHistoryCheck,
  tasks.activeAccountsHistoryCheck,
  tasks.activeAccountsListCheck,
  tasks.validatorsCheck,
  tasks.validatorsTelemetryCheck,
  tasks.epochStatsCheck,
  tasks.epochStartBlockCheck,
  tasks.stakingPoolMetadataInfoCheck,
  tasks.poolIdsCheck,
  tasks.tokensSupplyCheck,
  tasks.rpcStatusCheck,
  tasks.indexerStatusCheck,
  tasks.protocolConfigCheck,
];

export const runTasks = (context: Context) => {
  let cancelled = false;
  const publish: PublishTopic = (topic, output) => {
    const prevOutput = context.subscriptionsCache[topic];
    // TODO: Find a proper version of TypedEmitter
    context.subscriptionsCache[topic] = output;
    // @ts-expect-error
    void context.subscriptionsEventEmitter.emit(topic, output, prevOutput);
  };
  const timeouts: Record<string, NodeJS.Timeout> = {};
  Object.values(regularTasks).forEach((task) => {
    if (task.shouldSkip?.()) {
      return;
    }

    let timeout = SECOND;
    const runTask = async () => {
      try {
        timeout = await task.fn(publish, context);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(
          `Regular ${task.description} crashed due to:`,
          String(error)
        );
      } finally {
        if (timeout !== Infinity && !cancelled) {
          timeouts[task.description] = setTimeout(runTask, timeout);
        }
      }
    };
    void runTask();
  });
  return () => {
    cancelled = true;
    const timeoutIds = Object.values(timeouts);
    timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
  };
};
