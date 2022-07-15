export * from "../../common/src/types";

export type HealthStatus = { timestamp: number } & (
  | {
      ok: true;
    }
  | {
      ok: false;
      message?: string;
    }
);
