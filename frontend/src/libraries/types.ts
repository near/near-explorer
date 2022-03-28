declare const t: unique symbol;
export type Nominal<T, U> = T & { readonly [t]: U };

export type AccountId = Nominal<string, "AccountId">;
export type TransactionId = Nominal<string, "TransactionId">;

export type YoctoNEAR = Nominal<string, "YoctoNEAR">;

export type Bytes = Nominal<string, "Bytes">;
export type UTCTimestamp = Nominal<number, "UTCTimestamp">;

export function nominate<T, U>(value: T): Nominal<T, U> {
  return value as Nominal<T, U>;
}
