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
  Object.entries(process.env).forEach(([name, value]) => {
    if (!name.startsWith(prefixWithDelimiter)) {
      return;
    }
    set(
      overrides,
      name
        .slice(prefixWithDelimiter.length)
        .split(GROUP_DELIMITER)
        .map(camelCase),
      safeParse(value)
    );
  });
  return overrides;
};

export type Environment = "prod" | "dev" | "staging";

export const getEnvironment = (): Environment =>
  process.env.RENDER_SERVICE_ID
    ? process.env.RENDER_SERVICE_ID.includes("pr")
      ? "staging"
      : "prod"
    : "dev";
