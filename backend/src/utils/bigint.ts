import {
  nearNominationExponent,
  teraGasNominationExponent,
} from "@explorer/common/utils/near";

export const BIMax = (...args: bigint[]) =>
  args.reduce((m, e) => (e > m ? e : m));
export const BIMin = (...args: bigint[]) =>
  args.reduce((m, e) => (e < m ? e : m));

export const millisecondsToNanoseconds = (ms: number): bigint =>
  BigInt(ms) * BigInt(10 ** 6);

export const nanosecondsToMilliseconds = (ns: bigint): number =>
  Number(ns / BigInt(10 ** 6));

export const nearNomination = 10n ** BigInt(nearNominationExponent);
export const teraGasNomination = 10n ** BigInt(teraGasNominationExponent);
