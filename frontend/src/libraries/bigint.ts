import JSBI from "jsbi";
import {
  nearNominationExponent,
  teraGasNominationExponent,
} from "@explorer/common/utils/near";

export const zero = JSBI.BigInt(0);
export const minusOne = JSBI.BigInt(-1);
export const ten = JSBI.BigInt(10);

export const abs = (input: JSBI) => {
  if (JSBI.greaterThanOrEqual(input, zero)) {
    return input;
  }
  return JSBI.multiply(input, minusOne);
};
export const max = (...args: JSBI[]) =>
  args.reduce((m, e) => (JSBI.greaterThan(e, m) ? e : m));
export const min = (...args: JSBI[]) =>
  args.reduce((m, e) => (JSBI.lessThan(e, m) ? e : m));

export const cmp = (a: JSBI, b: JSBI) => {
  if (JSBI.equal(a, b)) {
    return 0;
  }
  if (JSBI.greaterThan(a, b)) {
    return 1;
  }
  return -1;
};

export const nearNomination = JSBI.exponentiate(
  ten,
  JSBI.BigInt(nearNominationExponent)
);

export { nearNominationExponent, teraGasNominationExponent };
