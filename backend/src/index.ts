import { setupWamp } from "./wamp";
import { withReporter } from "./utils";
import { databases, withPool } from "./db";
import { TELEMETRY_CREATE_TABLE_QUERY } from "./telemetry";
import { GlobalState, regularChecks } from "./checks";

async function main(): Promise<void> {
  console.log("Starting Explorer backend & WAMP listener...");
  const getSession = setupWamp();

  // Skip initializing Telemetry database if the backend is not configured to
  // save telemety data (it is absolutely fine for local development)
  if (databases.telemetryBackendWriteOnlyPool) {
    await withPool(databases.telemetryBackendWriteOnlyPool, (client) =>
      client.query(TELEMETRY_CREATE_TABLE_QUERY)
    );
  }

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
  };
  for (const check of regularChecks) {
    if (check.shouldSkip?.()) {
      continue;
    }
    const wrappedFn = withReporter(`Regular ${check.description}`, check.fn);
    console.log(`Starting regular check: ${check.description}`);
    const setTimeoutBound = () =>
      setTimeout(async () => {
        try {
          await wrappedFn(getSession, state);
        } catch (e) {
        } finally {
          setTimeoutBound();
        }
      }, check.interval);
    void wrappedFn(getSession, state);
  }
}

void main();
