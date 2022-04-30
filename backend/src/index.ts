import { initPubSub } from "./pubsub";
import { databases, withPool } from "./db";
import { TELEMETRY_CREATE_TABLE_QUERY } from "./telemetry";
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

  // Skip initializing Telemetry database if the backend is not configured to
  // save telemety data (it is absolutely fine for local development)
  if (databases.telemetryBackendWriteOnlyPool) {
    await withPool(databases.telemetryBackendWriteOnlyPool, (client) =>
      client.query(TELEMETRY_CREATE_TABLE_QUERY)
    );
  }

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
