const models = require("../models");

const {
  regularSyncNewNearcoreStateInterval,
  regularSyncMissingNearcoreStateInterval,
} = require("./config");
const { syncNewNearcoreState, syncMissingNearcoreState, syncGenesisState } = require("./sync");
const { setupWamp } = require("./wamp");

async function main() {
  console.log("Starting NEAR Explorer backend service...");

  await models.sequelize.sync();

  const regularSyncGenesisState = async () => {
    try {
      await syncGenesisState();
    } catch (error) {
      console.warn("Regular syncing Genesis state crashed due to:", error);
    }
  };
  setTimeout(regularSyncGenesisState, 0);

  // TODO: we should publish (push) the information about the new blocks/transcations via WAMP.
  const regularSyncNewNearcoreState = async () => {
    try {
      await syncNewNearcoreState();
    } catch (error) {
      console.warn("Regular syncing new Nearcore state crashed due to:", error);
    }
    setTimeout(
      regularSyncNewNearcoreState,
      regularSyncNewNearcoreStateInterval
    );
  };
  setTimeout(regularSyncNewNearcoreState, 0);

  const regularSyncMissingNearcoreState = async () => {
    try {
      await syncMissingNearcoreState();
    } catch (error) {
      console.warn(
        "Regular syncing missing Nearcore state crashed due to:",
        error
      );
    }
    setTimeout(
      regularSyncMissingNearcoreState,
      regularSyncMissingNearcoreStateInterval
    );
  };
  setTimeout(
    regularSyncMissingNearcoreState,
    regularSyncMissingNearcoreStateInterval
  );



  const wamp = setupWamp();
  console.log("Starting WAMP worker...");
  wamp.open();
}

main();
