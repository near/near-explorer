const BN = require("bn.js");
const nearApi = require("near-api-js");

const { getAllLockupAccountIds, getLastYesterdayBlock } = require("./db-utils");
const { nearRpc, queryFinalBlock } = require("./near");

const TIMEOUT = 3000;

let CIRCULATING_SUPPLY = {
  block_height: undefined,
  circulating_supply_in_yoctonear: undefined,
};

// utils from https://github.com/near/account-lookup/blob/master/script.js
const readOption = (reader, f, defaultValue) => {
  let x = reader.read_u8();
  return x === 1 ? f() : defaultValue;
};

// viewLockupState function taken from https://github.com/near/account-lookup/blob/master/script.js
const viewLockupState = async (contractId, blockHeight) => {
  // TODO do we want to change while(true) to "try 5 times and then kill yourself"?
  while (true) {
    try {
      const result = await nearRpc.sendJsonRpc("query", {
        request_type: "view_state",
        block_id: blockHeight,
        account_id: contractId,
        prefix_base64: "",
      });
      if (result.values.length === 0) {
        // TODO Is it OK to throw exception like that?
        throw `Unable to get account info for account ${contractId}`;
      }
      let value = Buffer.from(result.values[0].value, "base64");
      let reader = new nearApi.utils.serialize.BinaryReader(value);
      let owner = reader.read_string();
      let lockupAmount = reader.read_u128();
      let terminationWithdrawnTokens = reader.read_u128();
      let lockupDuration = reader.read_u64();

      let releaseDuration = readOption(
        reader,
        () => reader.read_u64(),
        new BN(0)
      );
      let lockupTimestamp = readOption(
        reader,
        () => reader.read_u64(),
        new BN(0)
      );

      let tiType = reader.read_u8();
      let transferInformation;
      if (tiType === 0) {
        let transfersTimestamp = reader.read_u64();
        transferInformation = { transfersTimestamp };
      } else {
        let transferPollAccountId = reader.read_string();
        transferInformation = { transferPollAccountId };
      }

      let vestingType = reader.read_u8();
      let vestingInformation;
      if (vestingType === 1) {
        let vestingHash = reader.read_array(() => reader.read_u8());
        vestingInformation = { vestingHash };
      } else if (vestingType === 2) {
        let start = reader.read_u64();
        let cliff = reader.read_u64();
        let end = reader.read_u64();
        vestingInformation = { start, cliff, end };
      } else if (vestingType === 3) {
        let unvestedAmount = reader.read_u128();
        let terminationStatus = reader.read_u8();
        vestingInformation = { unvestedAmount, terminationStatus };
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
      console.log(
        `Retry viewLockupState for account ${contractId} because error`,
        error
      );
      await new Promise((r) => setTimeout(r, TIMEOUT));
    }
  }
};

const saturatingSub = (a, b) => {
  let res = a.sub(b);
  return res.gte(new BN(0)) ? res : new BN(0);
};

const isAccountBroken = async (blockHeight, accountId) => {
  while (true) {
    try {
      const account = await nearRpc.sendJsonRpc("query", {
        request_type: "view_account",
        block_id: blockHeight,
        account_id: accountId,
      });
      return (
        account.code_hash === "3kVY9qcVRoW3B5498SMX6R3rtSLiCdmBzKs7zcnzDJ7Q"
      );
    } catch (error) {
      console.log(`Retrying to fetch ${accountId} code version...`, error);
      await new Promise((r) => setTimeout(r, TIMEOUT));
    }
  }
};

// https://github.com/near/core-contracts/blob/master/lockup/src/getters.rs#L64
const getLockedTokenAmount = async (lockupState, accountId, blockInfo) => {
  const phase2Time = new BN("1602614338293769340", 10);
  let now = new BN((new Date().getTime() * 1000000).toString(), 10);
  if (now.lte(phase2Time)) {
    return saturatingSub(
      lockupState.lockupAmount,
      lockupState.terminationWithdrawnTokens
    );
  }

  let lockupTimestamp = BN.max(
    phase2Time.add(lockupState.lockupDuration),
    lockupState.lockupTimestamp
  );
  let blockTimestamp = new BN(blockInfo.header.timestamp_nanosec, 10); // !!! Never take `timestamp`, it is rounded
  if (blockTimestamp.lt(lockupTimestamp)) {
    return saturatingSub(
      lockupState.lockupAmount,
      lockupState.terminationWithdrawnTokens
    );
  }

  let unreleasedAmount;
  if (lockupState.releaseDuration) {
    let startTimestamp = (await isAccountBroken(
      blockInfo.header.height,
      accountId
    ))
      ? phase2Time
      : lockupTimestamp;
    let endTimestamp = startTimestamp.add(lockupState.releaseDuration);
    if (endTimestamp.lt(blockTimestamp)) {
      unreleasedAmount = new BN(0);
    } else {
      let timeLeft = endTimestamp.sub(blockTimestamp);
      unreleasedAmount = lockupState.lockupAmount
        .mul(timeLeft)
        .div(lockupState.releaseDuration);
    }
  } else {
    unreleasedAmount = new BN(0);
  }

  let unvestedAmount;
  if (lockupState.vestingInformation) {
    if (lockupState.vestingInformation.unvestedAmount) {
      // was terminated
      unvestedAmount = lockupState.vestingInformation.unvestedAmount;
    } else if (lockupState.vestingInformation.start) {
      // we have schedule
      if (blockTimestamp.lt(lockupState.vestingInformation.cliff)) {
        unvestedAmount = lockupState.lockupAmount;
      } else if (blockTimestamp.gte(lockupState.vestingInformation.end)) {
        unvestedAmount = new BN(0);
      } else {
        let timeLeft = lockupState.vestingInformation.end.sub(blockTimestamp);
        let totalTime = lockupState.vestingInformation.end.sub(
          lockupState.vestingInformation.start
        );
        unvestedAmount = lockupState.lockupAmount.mul(timeLeft).div(totalTime);
      }
    }
  }
  if (unvestedAmount === undefined) {
    unvestedAmount = new BN(0);
  }

  return BN.max(
    saturatingSub(unreleasedAmount, lockupState.terminationWithdrawnTokens),
    unvestedAmount
  );
};

const getPermanentlyLockedTokens = async (blockHeight) => {
  const accountsToGetBalancesForSubtraction = [
    "lockup.near",
    "contributors.near",
  ];

  const balances = await Promise.all(
    accountsToGetBalancesForSubtraction.map(async (accountId) => {
      while (true) {
        try {
          const account = await nearRpc.sendJsonRpc("query", {
            request_type: "view_account",
            block_id: blockHeight,
            account_id: accountId,
          });
          return new BN(account.amount, 10);
        } catch (error) {
          console.log(`Retrying to fetch ${accountId} balance...`, error);
          await new Promise((r) => setTimeout(r, TIMEOUT));
        }
      }
    })
  );
  return balances.reduce((acc, current) => acc.add(current), new BN(0));
};

// Calculate last block in a previous day (moment before 00:00 UTC)
async function findLastYesterdayBlockHeight() {
  const finalBlock = await queryFinalBlock();
  let finalBlockTimestamp = new BN(finalBlock.header.timestamp_nanosec);
  const dayLength = new BN("86400000000000");
  let startOfDay = finalBlockTimestamp.sub(finalBlockTimestamp.mod(dayLength));
  let yesterdayBlock = await getLastYesterdayBlock(startOfDay);
  return parseInt(yesterdayBlock.block_height);
}

const calculateCirculatingSupply = async (blockHeight) => {
  if (blockHeight === undefined) {
    blockHeight = await findLastYesterdayBlockHeight();
  }
  console.log(`calculateCirculatingSupply STARTED for block ${blockHeight}`);
  const currentBlock = await nearRpc.sendJsonRpc("block", {
    block_id: blockHeight,
  });
  const totalSupply = new BN(currentBlock.header.total_supply, 10);
  const lockupAccountIds = await getAllLockupAccountIds(blockHeight);

  let allLockupTokenAmounts = [];
  for (let account of lockupAccountIds) {
    const lockupState = await viewLockupState(account.account_id, blockHeight);
    if (lockupState) {
      let amount = await getLockedTokenAmount(
        lockupState,
        account.account_id,
        currentBlock
      );
      allLockupTokenAmounts.push(amount);
    }
  }

  const lockedTokens = allLockupTokenAmounts.reduce(
    (acc, current) => acc.add(current),
    new BN(0)
  );
  const tokensFromSpecialAccounts = await getPermanentlyLockedTokens(
    blockHeight
  );
  CIRCULATING_SUPPLY = {
    block_height: blockHeight,
    circulating_supply_in_yoctonear: totalSupply
      .sub(lockedTokens)
      .sub(tokensFromSpecialAccounts)
      .toString(10),
  };
  console.log(
    `calculateCirculatingSupply FINISHED, ${CIRCULATING_SUPPLY.circulating_supply_in_yoctonear}`
  );
};

const getCirculatingSupply = async () => {
  return CIRCULATING_SUPPLY;
};

exports.calculateCirculatingSupply = calculateCirculatingSupply;
exports.getCirculatingSupply = getCirculatingSupply;
