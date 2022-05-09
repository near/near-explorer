import { set, camelCase } from "lodash";

const GROUP_DELIMITER = "__";

const safeParse = (input?: string): unknown => {
  try {
    return JSON.parse(input || "");
  } catch {
    return input;
  }
};

export const getOverrides = <T extends Partial<Record<string, unknown>>>(
  prefix: string
): T => {
  const overrides = {} as T;
  const prefixWithDelimiter = prefix + GROUP_DELIMITER;
  for (const [name, value] of Object.entries(process.env)) {
    if (!name.startsWith(prefixWithDelimiter)) {
      continue;
    }
    set(
      overrides,
      name
        .slice(prefixWithDelimiter.length)
        .split(GROUP_DELIMITER)
        .map(camelCase),
      safeParse(value)
    );
  }
  return overrides;
};

export const getBackendUrl = (input: {
  host: string;
  port: number;
  secure: boolean;
}): string => {
  return `${input.secure ? "wss" : "ws"}://${input.host}:${input.port}/ws`;
};
