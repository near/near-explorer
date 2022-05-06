import { initPubSub } from "./pubsub";
import { setup as setupTelemetryDb } from "./telemetry";
import { GlobalState, regularChecks } from "./checks";

async function main(): Promise<void> {
  const state: GlobalState = {
    transactionsCountHistoryForTwoWeeks: [],
    stakingPoolsDescriptions: new Map(),
    stakingPoolStakeProposalsFromContract: {
      timestampMap: new Map(),
      valueMap: new Map(),
      promisesMap: new Map(),
    },
    stakingPoolInfos: {
      timestampMap: new Map(),
      valueMap: new Map(),
      promisesMap: new Map(),
    },
    poolIds: [],
  };

  console.log("Starting Explorer backend & pub-sub controller...");
  const controller = initPubSub(state);

  await setupTelemetryDb();

  for (const check of regularChecks) {
    if (check.shouldSkip?.()) {
      continue;
    }
    console.log(`Starting regular check: ${check.description}`);

    const runCheck = async () => {
      try {
        await check.fn(controller, state);
      } catch (error) {
        console.warn(`Regular${check.description} crashed due to:`, error);
      } finally {
        setTimeoutBound();
      }
    };
    const setTimeoutBound = () => setTimeout(runCheck, check.interval);
    void runCheck();
  }
}

void main();
