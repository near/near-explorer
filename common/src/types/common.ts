export type NetworkName = "mainnet" | "testnet" | "guildnet" | "localhostnet";

// Workaround of Omit breaking discriminated unions
// https://github.com/microsoft/TypeScript/issues/31501
export type StableOmit<Type, K extends keyof Type> = {
  [Property in keyof Type as Exclude<Property, K>]: Type[Property];
};
