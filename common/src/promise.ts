export const timeout = <T>(ms: number): Promise<T> =>
  new Promise((_, reject) => setTimeout(reject, ms));

export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
