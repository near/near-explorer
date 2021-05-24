const BN = require("bn.js");
const nearApi = require("near-api-js");

const { getAllLockupAccountIds } = require("./db-utils");
const { nearRpc } = require("./near");

let CIRCULATING_SUPPLY = {
  block_height: undefined,
  circulating_supply_in_yoctonear: undefined,
};

// utils from https://github.com/near/account-lookup/blob/master/script.js
const readOption = (reader, f) => {
  let x = reader.read_u8();
  if (x == 1) {
    return f();
  }
  return null;
};

// viewLockupState function taken from https://github.com/near/account-lookup/blob/master/script.js
const viewLockupState = async (contractId, blockHeight) => {
  try {
    const result = await nearRpc.sendJsonRpc("query", {
      request_type: "view_state",
      block_id: blockHeight,
      account_id: contractId,
      prefix_base64: "U1RBVEU=",
    });
    if (result.values.length === 0) return null;
    let value = Buffer.from(result.values[0].value, "base64");
    let reader = new nearApi.utils.serialize.BinaryReader(value);
    let owner = reader.read_string();
    let lockupAmount = reader.read_u128().toString();
    let terminationWithdrawnTokens = reader.read_u128().toString();
    let lockupDuration = reader.read_u64().toString();
    let releaseDuration = readOption(reader, () =>
      reader.read_u64().toString()
    );
    let lockupTimestamp = readOption(reader, () =>
      reader.read_u64().toString()
    );
    let tiType = reader.read_u8();
    let transferInformation;
    if (tiType == 0) {
      transferInformation = {
        transfers_timestamp: reader.read_u64(),
      };
    } else {
      transferInformation = {
        transfer_poll_account_id: reader.read_string(),
      };
    }
    let vestingType = reader.read_u8();
    vestingInformation = null;
    if (vestingType == 1) {
      vestingInformation = {
        VestingHash: reader.read_array(() => reader.read_u8()),
      };
    } else if (vestingType == 2) {
      let vestingStart = reader.read_u64();
      let vestingCliff = reader.read_u64();
      let vestingEnd = reader.read_u64();
      vestingInformation = { vestingStart, vestingCliff, vestingEnd };
    } else if (vestingType == 3) {
      vestingInformation = "TODO";
    }
    return {
      owner,
      lockupAmount,
      terminationWithdrawnTokens,
      lockupDuration,
      releaseDuration,
      lockupTimestamp,
      transferInformation,
      vestingInformation,
    };
  } catch (error) {
    console.log(`Retry viewLockupState because error`, error);
    return await viewLockupState(contractId, blockHeight);
  }
};

// Get locked token amount function. Based on code from https://github.com/near/account-lookup/blob/master/script.js
const getLockedTokenAmount = async (
  lockupAccountId,
  lockupAmount,
  lockupState
) => {
  const phase2Time = 1602614338293769340;
  if (lockupAmount !== 0) {
    let duration = lockupState.releaseDuration
      ? new BN(lockupState.releaseDuration.toString())
      : new BN(0);
    let now = new Date().getTime() * 1000000;
    let passed = new BN(now.toString()).sub(
      lockupState.lockupTimestamp === null
        ? new BN(phase2Time.toString())
        : new BN(lockupState.lockupTimestamp.toString()).add(
            new BN(lockupState.lockupDuration.toString())
          )
    );
    let releaseComplete = lockupState.releaseDuration
      ? passed.gt(duration)
      : passed.gt(new BN(lockupState.lockupDuration));
    lockupState.releaseDuration = lockupState.releaseDuration
      ? duration
          .div(new BN("1000000000"))
          .divn(60 * 60 * 24)
          .toString(10)
      : null;

    if (!lockupState.transferInformation.transfers_timestamp) {
      if (releaseComplete) {
        return new BN(0);
      } else {
        if (lockupState.releaseDuration) {
          unlockedAmount = new BN(lockupAmount).mul(passed).div(duration);
          lockedAmount = new BN(lockupAmount).sub(unlockedAmount);
          return lockedAmount;
        } else if (!releaseComplete) {
          return new BN(lockupAmount);
        }
      }
    } else {
      while (true) {
        try {
          return new BN(
            await nearRpc.callViewMethod(
              lockupAccountId,
              "get_locked_amount",
              {}
            )
          );
        } catch (error) {
          console.error("GET LOCKED AMOUNT retry", error);
          continue;
        }
      }
    }
  }
  return new BN(lockedAmount);
};

// For proper calculation of circulating supply we need to subtract
// balances of some accounts
const getTokensToSubtractFromTotalSupply = async (blockHeight) => {
  const accountsToGetBalancesForSubtraction = ["contributors.near"];

  const balances = await Promise.all(
    accountsToGetBalancesForSubtraction.map(async (accountId) => {
      while (true) {
        try {
          const account = await nearRpc.sendJsonRpc("query", {
            request_type: "view_account",
            block_id: blockHeight,
            account_id: accountId,
          });
          return new BN(account.amount);
        } catch (error) {
          console.log(`Retrying to fetch ${accountId} balance...`, error);
          continue;
        }
      }
    })
  );
  console.log("TO SUBTRACT", balances);
  return balances.reduce((acc, current) => acc.add(current), new BN(0));
};

const calculateCirculatingSupply = async () => {
  // Get final block
  console.log(`calculateCirculatingSupply STARTED ${new Date()}`);
  const latestBlock = await nearRpc.sendJsonRpc("block", { finality: "final" });
  const totalSupply = new BN(latestBlock.header.total_supply, 10);
  const blockHeight = latestBlock.header.height;
  const lockupAccountIds = await getAllLockupAccountIds();

  // Call view state from rpc for each account to sum up locked tokens
  const allLockupTokenAmounts = await Promise.all(
    lockupAccountIds.map(async (account) => {
      const lockupState = await viewLockupState(
        account.account_id,
        blockHeight
      );
      if (lockupState) {
        const lockedAmount = await getLockedTokenAmount(
          account.account_id,
          lockupState.lockupAmount,
          { ...lockupState }
        );
        return lockedAmount;
      } else {
        return new BN(0);
      }
    })
  );
  const totalLockedTokens = allLockupTokenAmounts.reduce(
    (acc, current) => acc.add(current),
    new BN(0)
  );
  const amountToSubtract = await getTokensToSubtractFromTotalSupply(
    blockHeight
  );
  console.log(`calculateCirculatingSupply FINISHED ${new Date()}`);
  CIRCULATING_SUPPLY = {
    block_height: blockHeight,
    circulating_supply_in_yoctonear: totalSupply
      .sub(totalLockedTokens)
      .sub(amountToSubtract)
      .toString(10),
  };
};

const getCirculatingSupply = async () => {
  return CIRCULATING_SUPPLY;
};

exports.calculateCirculatingSupply = calculateCirculatingSupply;
exports.getCirculatingSupply = getCirculatingSupply;
