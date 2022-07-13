export const notNullGuard = <T>(arg: T): arg is Exclude<T, null> => {
  return arg !== null;
};
