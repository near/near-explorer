// See https://stackoverflow.com/a/49402091/2017859
export type KeysOfUnion<T> = T extends T ? keyof T : never;
