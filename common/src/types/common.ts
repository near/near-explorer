export type NetworkName =
  | "mainnet"
  | "testnet"
  | "shardnet"
  | "guildnet"
  | "localnet";

// Workaround of Omit breaking discriminated unions
// https://github.com/microsoft/TypeScript/issues/31501
export type StableOmit<Type, K extends keyof Type> = {
  [Property in keyof Type as Exclude<Property, K>]: Type[Property];
};

type IsTerminated<Input, Terminator, SuccessResult, FailureResult> =
  Input extends Terminator ? SuccessResult : FailureResult;

type FlattenStepOne<X, Terminator, Delimiter extends string> = {
  [K in keyof X as K extends string
    ? IsTerminated<
        X[K],
        Terminator,
        K,
        `${K}${Delimiter}${keyof X[K] & string}`
      >
    : K]: IsTerminated<
    X[K],
    Terminator,
    X[K],
    { [Key in keyof X[K]]: X[K][Key] }
  >;
};

type Value<X> = X[keyof X];

type Tail<
  S,
  Delimiter extends string
> = S extends `${string}${Delimiter}${infer T}` ? Tail<T, Delimiter> : S;

type FlattenStepTwo<X, Terminator, Delimiter extends string> = {
  [K in keyof X]: IsTerminated<
    X[K],
    Terminator,
    X[K],
    Value<{
      [M in keyof X[K] as M extends Tail<K, Delimiter> ? M : never]: X[K][M];
    }>
  >;
};

type FlattenOneLevel<X, Terminator, Delimiter extends string> = FlattenStepTwo<
  FlattenStepOne<X, Terminator, Delimiter>,
  Terminator,
  Delimiter
>;

// https://stackoverflow.com/a/69322301/2017859
export type Flatten<
  X,
  Terminator,
  Delimiter extends string
> = X extends FlattenOneLevel<X, Terminator, Delimiter>
  ? X
  : Flatten<FlattenOneLevel<X, Terminator, Delimiter>, Terminator, Delimiter>;

export type Unpacked<T> = T extends (infer U)[] ? U : T;
